"use client";

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

export interface ProjectAnalytics {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

const useGetProjectAnalytics = (projectId: string | undefined) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["project", projectId, "analytics"],
    queryFn: async (): Promise<ProjectAnalytics> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data } = await axiosInstance.get(
        `/projects/${projectId}/analytics`
      );
      return data;
    },
    enabled: !!projectId && projectId !== "undefined" && projectId.length > 0,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetProjectAnalytics;
