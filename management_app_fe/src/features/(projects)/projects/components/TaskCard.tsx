"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Edit2, Trash2, UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  setEditingTask: (task: Task) => void;
  handleTaskDelete: (taskId: string) => void;
  isDeletingTask: boolean;
  isDragDisabled: boolean;
}

export const TaskCard = ({
  task,
  index,
  setEditingTask,
  handleTaskDelete,
  isDeletingTask,
  isDragDisabled,
}: TaskCardProps) => (
  <Draggable
    draggableId={task.id}
    index={index}
    isDragDisabled={isDragDisabled}
  >
    {(provided, snapshot) => (
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`group cursor-pointer transition-all duration-200 border border-border hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 ${
          snapshot.isDragging ? "shadow-lg rotate-2" : ""
        }`}
      >
        <CardHeader className="pb-2 p-3 lg:p-4 lg:pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xs lg:text-sm line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
              {task.title}
            </CardTitle>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTask(task);
                }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskDelete(task.id);
                }}
                disabled={isDeletingTask}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {task.description && (
            <CardDescription className="text-xs line-clamp-2">
              {task.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 p-3 lg:p-4 lg:pt-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {task.assignee && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground min-w-0">
                  <UserIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{task.assignee.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Badge
              className="text-xs"
              style={{
                backgroundColor:
                  task.status === "TODO"
                    ? "#ef4444"
                    : task.status === "IN_PROGRESS"
                    ? "#f59e0b"
                    : "#10b981",
                color: "white",
              }}
            >
              {task.status === "TODO"
                ? "Todo"
                : task.status === "IN_PROGRESS"
                ? "In Progress"
                : "Done"}
            </Badge>
          </div>

          {isDragDisabled && (
            <p className="text-xs text-muted-foreground mt-2">Updating...</p>
          )}
        </CardContent>
      </Card>
    )}
  </Draggable>
);
