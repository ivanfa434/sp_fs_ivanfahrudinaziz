"use client";

import NoData from "@/components/NoData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useFormik } from "formik";
import {
  Download,
  Edit,
  Save,
  Settings,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { SettingsSkeleton } from "@/components/LoadingSkeleton";
import useExportProject from "@/hooks/api/export/useExportProject";
import useAddProjectMember from "@/hooks/api/project/useAddProjectMember";
import useDeleteProject from "@/hooks/api/project/useDeleteProject";
import useGetProject from "@/hooks/api/project/useGetProject";
import useGetProjectMembers from "@/hooks/api/project/useGetProjectMembers";
import useRemoveProjectMember from "@/hooks/api/project/useRemoveProjectMember";
import useUpdateProject from "@/hooks/api/project/useUpdateProject";
import useGetUsers from "@/hooks/api/users/useGetUsers";
import { getChangedValues } from "@/utils/getChangedValues";
import { InviteMemberSchema } from "../schema";
import NotFound from "@/components/NotFound";

interface ProjectSettingsContentProps {
  projectId: string;
}

export function ProjectSettingsContent({
  projectId,
}: ProjectSettingsContentProps) {
  const { data: session } = useSession();
  const { data: project, isPending, error } = useGetProject(projectId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);

  const { data: projectMembers, isPending: isMembersLoading } =
    useGetProjectMembers(projectId);
  const { mutateAsync: addMember, isPending: isAddingMember } =
    useAddProjectMember();
  const { mutateAsync: removeMember, isPending: isRemovingMember } =
    useRemoveProjectMember();
  const { mutateAsync: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();
  const { mutateAsync: updateProject, isPending: isUpdatingProject } =
    useUpdateProject(projectId);
  const { mutateAsync: exportProject, isPending: isExportingProject } =
    useExportProject();
  const { data: users } = useGetUsers();

  const initialProjectValues = {
    title: project?.title || "",
    description: project?.description || "",
  };

  const inviteMemberFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: InviteMemberSchema,
    onSubmit: async (values) => {
      await addMember({
        projectId,
        email: values.email,
      });

      setIsDialogOpen(false);
      inviteMemberFormik.resetForm();
    },
  });

  const updateProjectFormik = useFormik({
    initialValues: initialProjectValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = getChangedValues(values, initialProjectValues);

      if (Object.keys(payload).length > 0) {
        await updateProject(payload);
      }

      setIsEditingProject(false);
    },
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    inviteMemberFormik.resetForm();
  };

  const handleEditCancel = () => {
    setIsEditingProject(false);
    updateProjectFormik.resetForm();
  };

  const handleDeleteProject = async () => {
    await deleteProject(projectId);
  };

  const handleRemoveMember = async (userId: string) => {
    await removeMember({ projectId, userId });
  };

  if (isPending || isMembersLoading) {
    return <SettingsSkeleton />;
  }

  if (!project || error) {
    return (
      <NotFound
        title="Project Not Found"
        description="The project you're looking for doesn't exist or you don't have access to it."
      />
    );
  }

  const currentUserId = session?.user?.id;
  const projectOwnerId = project?.ownerId || project?.owner?.id;
  const isOwner =
    currentUserId && projectOwnerId && currentUserId === projectOwnerId;

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 lg:mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Project Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {project.title}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => exportProject(projectId)}
            disabled={isExportingProject}
            className="w-full sm:w-auto"
            size="default"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExportingProject ? "Exporting..." : "Export Project"}
          </Button>

          {isOwner && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" size="default">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-lg font-semibold">
                    Invite Team Member
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Enter the email address of the person you want to invite to
                    collaborate.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={inviteMemberFormik.handleSubmit}
                  className="space-y-5 mt-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={inviteMemberFormik.values.email}
                      onChange={inviteMemberFormik.handleChange}
                      onBlur={inviteMemberFormik.handleBlur}
                      className={`${
                        inviteMemberFormik.touched.email &&
                        inviteMemberFormik.errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      autoComplete="email"
                      list="users-list"
                    />

                    <datalist id="users-list">
                      {Array.isArray(users) &&
                        users.map((user) => (
                          <option key={user.id} value={user.email} />
                        ))}
                    </datalist>

                    {inviteMemberFormik.touched.email &&
                      inviteMemberFormik.errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {inviteMemberFormik.errors.email}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                      className="w-full sm:w-auto"
                      disabled={isAddingMember}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isAddingMember ||
                        !inviteMemberFormik.values.email.trim()
                      }
                      className="w-full sm:w-auto"
                    >
                      {isAddingMember ? "Inviting..." : "Send Invitation"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 max-w-6xl">
        <Card className="border-border hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Project Information
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Basic information about this project
                </CardDescription>
              </div>
              {isOwner && !isEditingProject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProject(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingProject ? (
              <form
                onSubmit={updateProjectFormik.handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Project Name *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={updateProjectFormik.values.title}
                    onChange={updateProjectFormik.handleChange}
                    onBlur={updateProjectFormik.handleBlur}
                    placeholder="Enter project name"
                    required
                  />
                  {updateProjectFormik.touched.title &&
                    updateProjectFormik.errors.title && (
                      <p className="text-xs text-red-500">
                        {updateProjectFormik.errors.title}
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={updateProjectFormik.values.description}
                    onChange={updateProjectFormik.handleChange}
                    onBlur={updateProjectFormik.handleBlur}
                    placeholder="Enter project description"
                    rows={3}
                    style={{ resize: "none" }}
                  />
                  {updateProjectFormik.touched.description &&
                    updateProjectFormik.errors.description && (
                      <p className="text-xs text-red-500">
                        {updateProjectFormik.errors.description}
                      </p>
                    )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" disabled={isUpdatingProject}>
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdatingProject ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditCancel}
                    disabled={isUpdatingProject}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Project Name
                  </Label>
                  <p className="text-sm font-medium">{project.title}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Owner
                  </Label>
                  <p className="text-sm font-medium">
                    {project.owner?.name || "Unknown Owner"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.owner?.email || "No email available"}
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Members
                  </Label>
                  <p className="text-sm font-medium">
                    {(projectMembers?.length || 0) + 1} member
                    {(projectMembers?.length || 0) + 1 !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {!isEditingProject && project.description && (
              <div className="pt-2 border-t border-border/50">
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="text-sm mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">
                  Team Members
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Manage project team members
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {(projectMembers?.length || 0) + 1} total
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-blue-50/50 border-blue-200/50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {project.owner?.name || "Unknown Owner"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {project.owner?.email || "No email available"}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Owner
                </span>
              </div>
            </div>

            {projectMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {member.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {isOwner && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isRemovingMember}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.user?.name}{" "}
                            from this project? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.user!.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}

            {(!projectMembers || projectMembers.length === 0) && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  No team members yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Invite someone to collaborate on this project!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isOwner && (
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-red-700 flex items-center space-x-2">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-sm text-red-600">
                Irreversible and destructive actions. Please be certain before
                proceeding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-800">
                    Delete this project
                  </p>
                  <p className="text-xs text-red-600">
                    This action cannot be undone. All project data will be
                    permanently deleted.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isDeletingProject}
                      className="w-full sm:w-auto"
                      size="default"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeletingProject ? "Deleting..." : "Delete Project"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{project.title}"? This
                        action cannot be undone. All project data, tasks, and
                        member associations will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProject}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Project
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
