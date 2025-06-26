"use client";

import { ProjectSkeleton } from "@/components/LoadingSkeleton";
import NotFound from "@/components/NotFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGetProjectAnalytics from "@/hooks/api/analytic/useGetProjectAnalytics";
import useGetProject from "@/hooks/api/project/useGetProject";
import useCreateTask from "@/hooks/api/task/useCreateTask";
import useDeleteTask from "@/hooks/api/task/useDeleteTask";
import useGetProjectTasks from "@/hooks/api/task/useGetProjectTasks";
import useUpdateTask from "@/hooks/api/task/useUpdateTask";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useFormik } from "formik";
import { BarChart3, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CreateTaskSchema } from "../schema";
import { EditTaskDialog } from "./EditTaskDialog";
import { TaskColumn } from "./TaskColumn";

interface ProjectContentProps {
  projectId: string;
}

export function ProjectContent({ projectId }: ProjectContentProps) {
  const { data: project, isPending: isLoadingProject } =
    useGetProject(projectId);

  const { data: tasks, isPending: isLoadingTasks } =
    useGetProjectTasks(projectId);

  const { data: analytics, isPending: isLoadingAnalytics } =
    useGetProjectAnalytics(projectId);
  const { mutateAsync: createTask, isPending: isCreatingTask } =
    useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdatingTask } =
    useUpdateTask(projectId);
  const { mutateAsync: deleteTask, isPending: isDeletingTask } =
    useDeleteTask(projectId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragUpdatingTaskId, setDragUpdatingTaskId] = useState<string | null>(
    null
  );
  const [allTasks, setAllTasks] = useState(tasks || project?.tasks || []);

  const formik = useFormik({
    initialValues: { title: "", description: "", assigneeId: "" },
    validationSchema: CreateTaskSchema,
    onSubmit: async (values) => {
      await createTask({
        ...values,
        projectId,
        assigneeId: values.assigneeId || undefined,
      });
      setIsCreateDialogOpen(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    setAllTasks(tasks || project?.tasks || []);
  }, [tasks, project?.tasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTask({ id: taskId, status: newStatus as any });
  };

  const handleTaskUpdate = async (
    taskId: string,
    data: Partial<Omit<Task, "id">>
  ) => {
    await updateTask({ id: taskId, ...data });
  };

  const handleTaskDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const statusMap: Record<string, string> = {
      TODO: "TODO",
      IN_PROGRESS: "IN_PROGRESS",
      DONE: "DONE",
    };

    const newStatus = statusMap[destination.droppableId] as
      | "TODO"
      | "IN_PROGRESS"
      | "DONE";

    if (newStatus) {
      if (dragUpdatingTaskId) return;

      try {
        setDragUpdatingTaskId(draggableId);

        setAllTasks((prev) =>
          prev.map((task) =>
            task.id === draggableId ? { ...task, status: newStatus } : task
          )
        );

        await handleStatusChange(draggableId, newStatus);
      } catch (error) {
        console.error("Failed to update task status:", error);
      } finally {
        setDragUpdatingTaskId(null);
      }
    }
  };

  if (isLoadingProject || isLoadingTasks) {
    return <ProjectSkeleton />;
  }

  if (!project) {
    return (
      <NotFound
        title="Project Not Found"
        description="The project you're looking for doesn't exist or you don't have access to it."
      />
    );
  }

  const allMembers = [
    ...(project.owner ? [project.owner] : []),
    ...(project.memberships
      ?.map((member) => member.user)
      .filter((user): user is User => !!user) || []),
  ];

  const chartData = analytics
    ? [
        { name: "Todo", value: analytics.todo, color: "#ef4444" },
        { name: "In Progress", value: analytics.inProgress, color: "#f59e0b" },
        { name: "Done", value: analytics.done, color: "#10b981" },
      ]
    : [];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-6 lg:mb-8">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold truncate">
            {project.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground line-clamp-2">
            {project.description || "No description"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-lg font-semibold">
                  Create New Task
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Add a new task to this project.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Task Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.title && formik.errors.title
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    maxLength={100}
                  />
                  {formik.touched.title && !!formik.errors.title && (
                    <p className="text-xs text-red-500">
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
                    placeholder="Enter task description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="resize-none min-h-[80px]"
                    maxLength={500}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigneeId" className="text-sm font-medium">
                    Assignee
                    <span className="text-xs text-muted-foreground ml-1">
                      (Optional)
                    </span>
                  </Label>
                  <Select
                    value={formik.values.assigneeId}
                    onValueChange={(value) =>
                      formik.setFieldValue(
                        "assigneeId",
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger id="assigneeId">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No assignee</SelectItem>
                      {allMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="w-full sm:w-auto"
                    disabled={isCreatingTask}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingTask || !formik.values.title.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isCreatingTask ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Link
            href={`/projects/${projectId}/settings`}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {analytics && !isLoadingAnalytics && (
        <div className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-4 lg:pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 lg:p-4 pt-0">
                <div className="text-lg lg:text-2xl font-bold">
                  {analytics.total}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-4 lg:pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium">
                  Todo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-4 pt-0">
                <div className="text-lg lg:text-2xl font-bold text-red-500">
                  {analytics.todo}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-4 lg:pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-4 pt-0">
                <div className="text-lg lg:text-2xl font-bold text-amber-500">
                  {analytics.inProgress}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-4 lg:pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium">
                  Done
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-4 pt-0">
                <div className="text-lg lg:text-2xl font-bold text-green-500">
                  {analytics.done}
                </div>
              </CardContent>
            </Card>
          </div>

          {analytics.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm lg:text-base">
                  Task Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[400px] lg:min-h-[600px]">
          <TaskColumn
            title="Todo"
            tasks={allTasks.filter((task) => task.status === "TODO") || []}
            status="TODO"
            setEditingTask={setEditingTask}
            handleTaskDelete={handleTaskDelete}
            isDeletingTask={isDeletingTask}
            dragUpdatingTaskId={dragUpdatingTaskId}
          />

          <TaskColumn
            title="In Progress"
            tasks={
              allTasks.filter((task) => task.status === "IN_PROGRESS") || []
            }
            status="IN_PROGRESS"
            setEditingTask={setEditingTask}
            handleTaskDelete={handleTaskDelete}
            isDeletingTask={isDeletingTask}
            dragUpdatingTaskId={dragUpdatingTaskId}
          />

          <TaskColumn
            title="Done"
            tasks={allTasks.filter((task) => task.status === "DONE") || []}
            status="DONE"
            setEditingTask={setEditingTask}
            handleTaskDelete={handleTaskDelete}
            isDeletingTask={isDeletingTask}
            dragUpdatingTaskId={dragUpdatingTaskId}
          />
        </div>
      </DragDropContext>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          members={allMembers}
          onUpdate={handleTaskUpdate}
          isUpdating={isUpdatingTask}
        />
      )}
    </div>
  );
}
