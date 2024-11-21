// Next Imports
import type { Metadata } from "next";

// Component Imports
import ResetPassword from "@/views/ResetPassword";

// Server Action Imports
import { getServerMode } from "@core/utils/serverHelpers";
import CreatePassword from "@/views/CreatePassword";

export const metadata: Metadata = {
  title: "Create Password",
  description: "Create Password to your account",
};

const CreatePasswordPage = () => {
  // Vars
  const mode = getServerMode();

  return <CreatePassword />;
};

export default CreatePasswordPage;
