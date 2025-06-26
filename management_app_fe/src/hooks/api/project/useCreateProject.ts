"use client";

import useAxios from "@/hooks/useAxios";
import { CreateProjectPayload } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateProject = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data } = await axiosInstance.post("/projects", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to create project");
    },
  });
};

export default useCreateProject;
