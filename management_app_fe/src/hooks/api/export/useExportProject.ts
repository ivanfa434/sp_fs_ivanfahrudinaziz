"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useExportProject = () => {
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await axiosInstance.get(`/projects/${projectId}/export`);
      return data;
    },
    onSuccess: (data, projectId) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `project-${projectId}-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Project exported successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to export project");
    },
  });
};

export default useExportProject;
