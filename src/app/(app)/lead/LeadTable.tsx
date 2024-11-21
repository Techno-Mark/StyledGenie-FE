"use client";

import { ThemeColor } from "@/@core/types";
import DialogsAlert from "@/components/dialogs/alert-dialog";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import TablePaginationComponent from "@/components/TablePaginationComponent";
import { post } from "@/services/apiService";
import { LeadAPIs } from "@/services/endpoint/leadList";
import { usersList } from "@/services/endpoint/usersList";
import { checkPermission } from "@/utils/permissionCheckFunction";
import CustomTextField from "@core/components/mui/TextField";
import tableStyles from "@core/styles/table.module.css";
import { CardHeader, MenuItem, TextFieldProps, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useRouter } from "next/navigation";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { rankItem } from "@tanstack/match-sorter-utils";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
// import AddLeadDrawer from "./AddLeadDrawer";

export interface LeadsType {
  leadId: number;
  fullName: string;
  email: string;
  mobileNumber: number;
  status: string;
}

type LeadsTypeWithAction = LeadsType & {
  action?: string;
};

type LeadStatusType = {
  [key: string]: ThemeColor;
};

// Fuzzy filter implementation
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// Debounced input component for search
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const userStatusObj: LeadStatusType = {
  Accepted: "success",
  Pending: "warning",
  Rejected: "error",
};

// Column Definitions
const columnHelper = createColumnHelper<LeadsTypeWithAction>();

const LeadListTable = ({ tableData }: { tableData?: LeadsType[] }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<LeadsType[]>(tableData || []);
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getData = async () => {
    setLoading(true);
    try {
      const result = await post(LeadAPIs.leadList, {
        page: page + 1,
        limit: pageSize,
        search: globalFilter,
        status: activeFilter,
      });
      setData(result.ResponseData.leads);
      setTotalRows(result.ResponseData.totalLeads);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [page, pageSize, globalFilter, activeFilter]);

  const columns = useMemo<ColumnDef<LeadsTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor((_, index) => index + 1, {
        header: "Sr. No",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.index + 1}
            </Typography>
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("fullName", {
        header: "Full Name",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.original.fullName}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography color="text.primary">
              {row.original.email.toLowerCase()}
            </Typography>
          </div>
        ),
      }),

      columnHelper.accessor("status", {
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={row.original.status}
              size="small"
              color={userStatusObj[row.original.status]}
              className="capitalize"
            />
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <>
            {row.original.status !== "Rejected" && (
              <div className="flex items-center">
                {row.original.status === "Pending" && (
                  <Tooltip title="View Prdouct Recommendation" placement="top">
                    <IconButton
                      onClick={() =>
                        router.push("/lead/view/" + row.original.leadId)
                      }
                      color={userStatusObj[row.original.status]}
                    >
                      <i className="tabler-eye text-textSecondary" />
                    </IconButton>
                  </Tooltip>
                )}

                {row.original.status === "Accepted" && (
                  <Tooltip title="View Accepted Product" placement="top">
                    <IconButton
                      onClick={() =>
                        router.push("/lead/view/" + row.original.leadId)
                      }
                      color={userStatusObj[row.original.status]}
                    >
                      <i className="tabler-eye text-textSecondary" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )}
          </>
        ),
        enableSorting: false,
      }),
    ],
    [data]
  );

  const table = useReactTable<LeadsTypeWithAction>({
    data: data as LeadsTypeWithAction[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = (event: unknown, newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-2 border-bs gap-4">
          <LoadingBackdrop isLoading={loading} />
          <CardHeader title="Lead List" />
          <div className="flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search User"
              className="max-sm:is-full"
            />
            <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
              <Typography>Status:</Typography>
              <CustomTextField
                select
                fullWidth
                defaultValue="all"
                id="custom-select"
                value={activeFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setActiveFilter(value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </CustomTextField>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="tabler-chevron-up text-xl" />,
                            desc: <i className="tabler-chevron-down text-xl" />,
                          }[header.column.getIsSorted() as "asc" | "desc"] ??
                            null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          component="div"
          count={totalRows}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
    </>
  );
};

export default LeadListTable;
