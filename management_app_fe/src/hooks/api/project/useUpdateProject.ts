"use client";

import useAxios from "@/hooks/useAxios";
import type { CreateProjectPayload } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useUpdateProject = (projectId?: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: Partial<CreateProjectPayload>) => {
      if (!projectId) throw new Error("Project ID is required");

      const { title, description } = payload;
      const updateData: Record<string, string> = {};

      if (title) updateData.title = title;
      if (description) updateData.description = description;

      const { data } = await axiosInstance.patch(
        `/projects/${projectId}`,
        updateData
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Update project success");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      router.push("/");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to update project");
    },
  });
};

export default useUpdateProject;
