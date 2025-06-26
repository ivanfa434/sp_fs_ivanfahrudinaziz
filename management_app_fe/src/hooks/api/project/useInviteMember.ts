"use client";

import useAxios from "@/hooks/useAxios";
import type { InviteMemberPayload } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useInviteMember = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InviteMemberPayload) => {
      const { data } = await axiosInstance.post(
        `/projects/${payload.projectId}/invite`,
        { email: payload.email }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Member invited successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to invite member");
    },
  });
};

export default useInviteMember;
