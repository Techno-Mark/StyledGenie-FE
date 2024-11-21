import { authOptions } from "@/libs/auth";
import { Grid } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LeadListTable from "./LeadTable";

const UserApp = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <Grid item xs={12} spacing={6}>
      <Grid item xs={12}>
        <LeadListTable />
      </Grid>
    </Grid>
  );
};

export default UserApp;
