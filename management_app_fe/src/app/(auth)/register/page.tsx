import RegisterPage from "@/features/(auth)/register";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Register = async () => {
  const session = await auth();

  if (session) return redirect("/dashboard");
  return <RegisterPage />;
};

export default Register;
