// MUI Imports
import CustomTextField from "@/@core/components/mui/TextField";
import { MenuItem } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

// Third Party Imports
import { Table } from "@tanstack/react-table";

interface TablePaginationComponentProps<T> {
  table: Table<T>;
}

function TablePaginationComponent<T>({
  table,
}: TablePaginationComponentProps<T>) {
  return (
    <div className="flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2">
      <Typography color="text.disabled">
        {`Showing ${
          table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1
        }
        to ${Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )} of ${table.getFilteredRowModel().rows.length} entries`}
      </Typography>
      <div className="flex gap-4">
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="is-[70px]"
        >
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="50">50</MenuItem>
        </CustomTextField>
        <Pagination
          shape="rounded"
          color="primary"
          variant="tonal"
          count={Math.ceil(
            table.getFilteredRowModel().rows.length /
              table.getState().pagination.pageSize
          )}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => {
            table.setPageIndex(page - 1);
          }}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
}

export default TablePaginationComponent;
