import { TimeDropdown } from "@/components/TimeDropdown"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/types/task"
import { format } from "date-fns"
import { Pause, Play } from "lucide-react"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
  onAddChild?: (parentId: number) => void
  isParent?: boolean
}

export function TaskItem({
  task,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
  onAddChild,
  isParent,
}: TaskItemProps) {
  const formattedTime = task.timestamp
    ? format(new Date(task.timestamp), "h:mm a")
    : ""

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-6 ${
        task.completed
          ? "bg-gray-100 opacity-75 dark:bg-gray-800"
          : task.timeRemaining === 0
            ? "border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
            : task.paused
              ? "bg-white dark:bg-gray-800"
              : "bg-white/80 dark:bg-gray-800/80"
      } ${isParent ? "border-amber-300 dark:border-gray-400" : ""}`}
    >
      <div className="flex flex-1 items-center gap-6">
        {!isParent && (
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="h-6 w-6"
          />
        )}
        <span
          className={`flex-1 text-lg ${
            task.completed
              ? "text-gray-500 line-through dark:text-gray-400"
              : isParent
                ? "font-semibold text-amber-700 dark:text-amber-300"
                : "text-amber-900 dark:text-amber-100"
          }`}
        >
          {task.text}
        </span>
        <span
          className="text-xs text-gray-500 dark:text-gray-400"
          title={`Created at ${formattedTime}`}
        >
          {task.date}
        </span>
        {!isParent && (
          <>
            <Button
              onClick={() => onPause(task.id)}
              variant="outline"
              disabled={task.completed}
              className="w-10 p-2"
            >
              {task.paused ? (
                <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <Pause className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
            </Button>

            <TimeDropdown
              timeRemaining={task.timeRemaining}
              onAdjust={(amount) => onTimeAdjust(task.id, amount)}
            />
          </>
        )}
        {isParent && onAddChild && (
          <Button
            onClick={() => onAddChild(task.id)}
            variant="outline"
            className="border-amber-200 hover:bg-amber-100 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            Add Task
          </Button>
        )}
      </div>
      <Button
        onClick={() => onDelete(task.id)}
        variant="ghost"
        className="ml-6 text-2xl font-bold text-red-300 hover:text-red-500 dark:text-red-600 dark:hover:text-red-400"
      >
        ×
      </Button>
    </div>
  )
}
