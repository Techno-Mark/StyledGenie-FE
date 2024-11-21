// Next Imports
import type { Metadata } from "next";

// Component Imports
import ResetPassword from "@/views/ResetPassword";

// Server Action Imports
import { getServerMode } from "@core/utils/serverHelpers";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password to your account",
};

const ResetPasswordPage = () => {
  // Vars
  const mode = getServerMode();

  return <ResetPassword />;
};

export default ResetPasswordPage;
