import React, { useState } from "react";
import {
  Button,
  Box,
  Card,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { LeadDataType } from "./page";
import { post } from "@/services/apiService";
import { LeadAPIs } from "@/services/endpoint/leadList";

type Props = {
  leadData: LeadDataType;
  handleClose: () => void;
};

const LeadViewPage = ({ leadData, handleClose }: Props) => {
  return (
    <>
      {leadData.status === "Pending" && (
        <LeadViewComponent leadData={leadData} handleClose={handleClose} />
      )}
      {leadData.status === "Accepted" && (
        <AcceptedLeadViewComponent
          leadData={leadData}
          handleClose={handleClose}
        />
      )}
      {leadData.status === "Rejected" && (
        <Typography variant="h2" className="mb-2 ml-2">
          You already rejected this user product recommendation
        </Typography>
      )}
    </>
  );
};

const LeadViewComponent = ({ leadData, handleClose }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  const handleCheckboxChange = (index: number) => {
    const updatedSelectedProducts = new Set(selectedProducts);

    if (updatedSelectedProducts.has(index)) {
      updatedSelectedProducts.delete(index);
    } else {
      updatedSelectedProducts.add(index);
    }

    setSelectedProducts(updatedSelectedProducts);
  };

  const handleApprove = async (rejectAll = false) => {
    let approvedProducts = leadData?.recommendedProduct?.filter((_, index) =>
      selectedProducts.has(index)
    );
    if (rejectAll) {
      approvedProducts = undefined;
    }

    setLoading(true);
    try {
      const result = await post(LeadAPIs.saveApproveProduct, {
        leadId: leadData.leadId,
        approvedProduct: approvedProducts,
      });
      router.push("/lead");
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingBackdrop isLoading={loading} />

      {/* <BreadCrumbList /> */}
      <Typography variant="h4" className="mb-2 ml-2">
        {leadData.firstName + " " + leadData.lastName}
      </Typography>

      <Card className="p-5">
        <Typography variant="h5" className="mb-5">
          Recommended Products
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {leadData?.recommendedProduct?.map((product, index) => (
            <div
              onClick={() => handleCheckboxChange(index)}
              key={index}
              className="bg-white rounded-lg shadow-md cursor-pointer p-4 flex flex-col items-center relative"
            >
              <Image
                src={"https://static.wixstatic.com/media/" + product.Image}
                alt={product["Product Name"]}
                width={150}
                height={150}
                className="rounded-lg object-cover mb-4"
              />
              <Typography variant="h6" className="text-center mb-2">
                {product["Product Name"]}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-1">
                {product.AdditionalInformation}
              </Typography>
              <Typography
                variant="body1"
                className="text-indigo-600 font-semibold"
              >
                ${product.Price}
              </Typography>

              <FormControlLabel
                label=""
                className="absolute right-0"
                control={
                  <Checkbox
                    checked={selectedProducts.has(index)}
                    name="controlled"
                  />
                }
              />
            </div>
          ))}
          {!leadData?.recommendedProduct?.length && (
            <Typography variant="h4" className="mb-2 ml-2">
              Recommended Product Not Found
            </Typography>
          )}
        </div>
      </Card>

      <Grid item xs={12} style={{ position: "sticky", bottom: 0, zIndex: 10 }}>
        <Box
          p={1}
          display="flex"
          gap={2}
          justifyContent="end"
          bgcolor="background.paper"
        >
          <Button variant="outlined" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            size="small"
            onClick={() => handleApprove()}
            disabled={selectedProducts.size === 0}
          >
            Approve selected product only
          </Button>

          <Button
            variant="contained"
            type="submit"
            size="small"
            onClick={() => handleApprove(true)}
            color="error"
            disabled={
              !leadData?.recommendedProduct || selectedProducts.size > 0
            }
          >
            Reject All
          </Button>
        </Box>
      </Grid>
    </>
  );
};

const AcceptedLeadViewComponent = ({ leadData, handleClose }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingBackdrop isLoading={loading} />

      {/* <BreadCrumbList /> */}
      <Typography variant="h4" className="mb-2 ml-2">
        {leadData.firstName + " " + leadData.lastName}
      </Typography>

      <Card className="p-5">
        <Typography variant="h5" className="mb-5">
          Accepted Products
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {leadData?.approvedProduct?.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md cursor-pointer p-4 flex flex-col items-center relative"
            >
              <Image
                src={"https://static.wixstatic.com/media/" + product.Image}
                alt={product["Product Name"]}
                width={150}
                height={150}
                className="rounded-lg object-cover mb-4"
              />
              <Typography variant="h6" className="text-center mb-2">
                {product["Product Name"]}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-1">
                {product.AdditionalInformation}
              </Typography>
              <Typography
                variant="body1"
                className="text-indigo-600 font-semibold"
              >
                ${product.Price}
              </Typography>
            </div>
          ))}
          {!leadData?.approvedProduct?.length && (
            <Typography variant="h4" className="mb-2 ml-2">
              Accepted Recommended Product Not Found
            </Typography>
          )}
        </div>
      </Card>
      <Grid item xs={12} style={{ position: "sticky", bottom: 0, zIndex: 10 }}>
        <Box
          p={1}
          display="flex"
          gap={2}
          justifyContent="end"
          bgcolor="background.paper"
        >
          <Button variant="outlined" size="small" onClick={handleClose}>
            Back
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default LeadViewPage;
