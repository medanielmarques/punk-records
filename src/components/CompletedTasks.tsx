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
  onRename: (id: number, newName: string) => void
}

export function CompletedTasks({
  tasks,
  showCompleted,
  onToggleShow,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
  onRename,
}: CompletedTasksProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
          Completed Tasks
        </h2>
        <Button
          variant="ghost"
          onClick={() => onToggleShow(!showCompleted)}
          className="text-sm text-gray-600 hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-400"
        >
          {showCompleted ? "Hide" : "Show"}
        </Button>
      </div>

      {showCompleted && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onPause={onPause}
              onTimeAdjust={onTimeAdjust}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  )
}
