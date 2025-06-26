"use client";

import useAxios from "@/hooks/useAxios";
import { Project } from "@/types/project";
import { useQuery } from "@tanstack/react-query";

const useGetProjects = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data } = await axiosInstance.get("/projects");
      return data;
    },
  });
};

export default useGetProjects;
