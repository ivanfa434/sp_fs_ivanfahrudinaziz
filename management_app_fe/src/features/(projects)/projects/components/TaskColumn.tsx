import { Task } from "@/types/task";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  setEditingTask: (task: Task) => void;
  handleTaskDelete: (taskId: string) => void;
  isDeletingTask: boolean;
  dragUpdatingTaskId: string | null;
}

export const TaskColumn = ({
  title,
  tasks,
  status,
  setEditingTask,
  handleTaskDelete,
  isDeletingTask,
  dragUpdatingTaskId,
}: TaskColumnProps) => (
  <div className="flex-1 min-w-0">
    <div className="bg-muted/50 rounded-lg p-3 lg:p-4 h-full">
      <h3 className="font-semibold mb-3 lg:mb-4 flex items-center justify-between text-sm lg:text-base">
        {title}
        <span className="text-xs lg:text-sm text-muted-foreground">
          ({tasks.length})
        </span>
      </h3>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 lg:space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? "bg-muted/70 rounded-lg p-2" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                setEditingTask={setEditingTask}
                handleTaskDelete={handleTaskDelete}
                isDeletingTask={isDeletingTask}
                isDragDisabled={dragUpdatingTaskId === task.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  </div>
);
