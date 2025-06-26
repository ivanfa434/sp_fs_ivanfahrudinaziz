import ProjectSettingsPage from "@/features/(projects)/projects-settings";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ProjectSettingsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectSettings({
  params,
}: ProjectSettingsProps) {
  const session = await auth();

  if (!session) return redirect("/login");
  const { id } = await params;
  return <ProjectSettingsPage projectId={id} />;
}
