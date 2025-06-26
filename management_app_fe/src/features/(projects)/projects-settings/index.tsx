import React from "react";
import { ProjectSettingsContent } from "./components/ProjectSettingsContent";

interface ProjectSettingsPageProps {
  projectId: string;
}

const ProjectSettingsPage = ({ projectId }: ProjectSettingsPageProps) => {
  return <ProjectSettingsContent projectId={projectId} />;
};

export default ProjectSettingsPage;
