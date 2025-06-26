"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import type { Task } from "@/types/task";
import type { User } from "@/types/user";
import { getChangedValues } from "@/utils/getChangedValues";
import { useFormik } from "formik";
import { FC } from "react";
import { CreateTaskSchema } from "../schema";

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  onUpdate: (taskId: string, data: any) => Promise<void>;
  isUpdating: boolean;
}

export const EditTaskDialog: FC<EditTaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  members,
  onUpdate,
  isUpdating,
}) => {
  const initialValues = {
    title: task.title || "",
    description: task.description || "",
    assigneeId: task.assigneeId || "",
    status: task.status || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: CreateTaskSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = getChangedValues(values, initialValues);
        await onUpdate(task.id, payload);
        onClose();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold">Edit Task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update task details and assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="edit-title"
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
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-red-500">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Description
              <span className="text-xs text-muted-foreground ml-1">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="edit-description"
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
            <Label htmlFor="edit-status" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-assignee" className="text-sm font-medium">
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
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No assignee</SelectItem>
                {members.map((member) => (
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
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !formik.values.title.trim()}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
