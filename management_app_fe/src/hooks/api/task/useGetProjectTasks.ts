"use client";

import useAxios from "@/hooks/useAxios";
import type { Task } from "@/types/task";
import { useQuery } from "@tanstack/react-query";

const useGetProjectTasks = (projectId: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["project", projectId, "tasks"],
    queryFn: async (): Promise<Task[]> => {
      const { data } = await axiosInstance.get(`/projects/${projectId}/tasks`);
      return data;
    },
    enabled: !!projectId,
  });
};

export default useGetProjectTasks;
