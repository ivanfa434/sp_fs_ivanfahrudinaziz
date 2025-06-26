"use client";

import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCreateProject from "@/hooks/api/project/useCreateProject";
import useGetProjects from "@/hooks/api/project/useGetProjects";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { useFormik } from "formik";
import { Calendar, CheckSquare, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProjectSchema } from "../schema";

export function DashboardContent() {
  const { data: projects, isPending } = useGetProjects();
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: CreateProjectSchema,
    onSubmit: async (values) => {
      try {
        await createProject(values);
        setIsDialogOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error("Failed to create project:", error);
      }
    },
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    formik.resetForm();
  };

  if (isPending) {
    return <DashboardSkeleton />;
  }

  const hasProjects = projects && projects.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 lg:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your projects and collaborate with your team
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" size="default">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-lg font-semibold">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Create a new project to start collaborating with your team.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Website Redesign, Mobile App"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.title && formik.errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                  autoComplete="off"
                  maxLength={100}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                  <span className="text-xs text-muted-foreground ml-1">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your project goals and objectives..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="resize-none min-h-[80px]"
                  maxLength={500}
                />
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {formik.values.description.length}/500
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="w-full sm:w-auto"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !formik.values.title.trim()}
                  className="w-full sm:w-auto"
                >
                  {isCreating ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasProjects ? (
        <div className="text-center py-12 lg:py-16">
          <NoData />
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You don't have any projects yet. Create your first project to get
              started with team collaboration.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 cursor-pointer border-border hover:border-blue-200 group">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-base font-semibold group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed min-h-[3rem]">
                      {project.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {project._count?.memberships || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {project._count?.tasks || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 pt-1 border-t border-border/50">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Updated{" "}
                          {new Date(project.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
