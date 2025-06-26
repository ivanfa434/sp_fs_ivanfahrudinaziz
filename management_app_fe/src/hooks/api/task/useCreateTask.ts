"use client";

import useAxios from "@/hooks/useAxios";
import { CreateTaskPayload } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateTask = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const { projectId, ...rest } = payload;

      const { data } = await axiosInstance.post(
        `/projects/${projectId}/tasks`,
        rest
      );

      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to create task");
    },
  });
};

export default useCreateTask;
