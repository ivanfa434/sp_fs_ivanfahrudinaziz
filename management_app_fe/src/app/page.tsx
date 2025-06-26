import { redirect } from "next/navigation";

export default async function HomePage() {
  if (typeof window !== "undefined") {
    import("@/components/Loading")
  }
  
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
