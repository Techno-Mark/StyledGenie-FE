import React from "react";
import ChangePasswordCard from "./ChangePasswordCard";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

const ChangePassword = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error("No session found");
    return null; 
  }

  return <ChangePasswordCard userId={Number(session?.user.id)} />;
};

export default ChangePassword;
