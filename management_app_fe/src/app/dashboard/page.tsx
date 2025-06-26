import DashboardPage from "@/features/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) return redirect("/login");
  return <DashboardPage />;
}
