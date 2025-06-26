"use client";

import useAxios from "@/hooks/useAxios";
import type { ProjectMember } from "@/types/project";
import { useQuery } from "@tanstack/react-query";

const useGetProjectMembers = (projectId: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["project", projectId, "members"],
    queryFn: async (): Promise<ProjectMember[]> => {
      const { data } = await axiosInstance.get(
        `/projects/${projectId}/members`
      );
      return data;
    },
    enabled: !!projectId,
  });
};

export default useGetProjectMembers;
