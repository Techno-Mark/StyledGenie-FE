"use client"

import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { post } from "@/services/apiService"
import LoadingBackdrop from "@/components/LoadingBackdrop"
import { LeadAPIs } from "@/services/endpoint/leadList"
import LeadViewPage from "./LeadViewPage"

export type RecommenedProductsType = {
  Image: string;
  Price: string;
  "Product Name": string;
  AdditionalInformation: string;
};

export type LeadDataType = {
  leadId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  status:string;
  productQuery: string | null;
  formData:any;
  recommendedProduct:Array<RecommenedProductsType> | null;
  approvedProduct: Array<RecommenedProductsType> | null;
}

const Page = ({ params }: { params: { id: string } }) => {
  const [leadData, setLeadData] = useState<LeadDataType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchData = async () => {
    try {
      const response = await post(LeadAPIs.getLeadById, {
          leadId: params.id
      })

      setLeadData(response.ResponseData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  console.log('lead data ...', leadData?.email, 'hehe')

  useEffect(() => {
    fetchData()
  }, [])

  // useEffect(() => {
  //   fetchData()
  // }, [params.id])

  if(!loading && !leadData){
    redirect("/not-found");
  }

  return (
    <>
      <LoadingBackdrop isLoading={loading} />
      {!loading && leadData && (
        <LeadViewPage
          leadData={leadData}
          handleClose={() => router.push("/lead")}
        />
      )}
    </>
  )
}

export default Page
