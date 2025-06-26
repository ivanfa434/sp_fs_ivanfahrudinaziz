import { ProjectPage } from "@/features/(projects)/projects";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Project({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session) return redirect("/login");
  const { id } = await params;
  return <ProjectPage projectId={id} />;
}
