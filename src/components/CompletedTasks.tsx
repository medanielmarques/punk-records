import { Task } from "@/types/task"

import { TaskItem } from "./TaskItem"
import { Button } from "./ui/button"

interface CompletedTasksProps {
  tasks: Task[]
  showCompleted: boolean
  onToggleShow: (show: boolean) => void
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
}

export function CompletedTasks({
  tasks,
  showCompleted,
  onToggleShow,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
}: CompletedTasksProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
          Completed Tasks
        </h2>
        <Button
          variant="ghost"
          onClick={() => onToggleShow(!showCompleted)}
          className="text-sm text-gray-500"
        >
          {showCompleted ? "Hide" : "Show"}
        </Button>
      </div>

      {showCompleted && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onPause={onPause}
              onTimeAdjust={onTimeAdjust}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
