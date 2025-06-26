import React from "react";
import { ProjectContent } from "./components/ProjectContent";

interface ProjectPageProps {
  projectId: string;
}

export function ProjectPage({ projectId }: ProjectPageProps) {
  return <ProjectContent projectId={projectId} />;
}
