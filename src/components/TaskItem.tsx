import { TimeDropdown } from "@/components/TimeDropdown"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
}

export function TaskItem({
  task,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-6 ${
        task.completed
          ? "bg-gray-100 opacity-75 dark:bg-gray-800"
          : task.timeRemaining === 0
            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-gray-800/50"
            : task.paused
              ? "bg-white dark:bg-gray-800"
              : "bg-white/80 dark:bg-gray-800/80"
      }`}
    >
      <div className="flex flex-1 items-center gap-6">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-6 w-6"
        />
        <span
          className={`flex-1 text-lg ${
            task.completed
              ? "text-gray-500 line-through dark:text-gray-400"
              : "text-amber-900 dark:text-amber-100"
          }`}
        >
          {task.text}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {task.date}
        </span>
        <Button
          onClick={() => onPause(task.id)}
          variant={task.paused ? "secondary" : "default"}
          disabled={task.completed}
          className={
            task.paused
              ? "bg-green-100 dark:bg-green-900"
              : "bg-amber-200 dark:bg-amber-800"
          }
        >
          {task.paused ? "Start" : "Pause"}
        </Button>

        <TimeDropdown
          timeRemaining={task.timeRemaining}
          onAdjust={(amount) => onTimeAdjust(task.id, amount)}
        />
      </div>
      <Button
        onClick={() => onDelete(task.id)}
        variant="ghost"
        className="ml-6 text-2xl font-bold text-amber-300 hover:text-red-500 dark:text-amber-600 dark:hover:text-red-400"
      >
        ×
      </Button>
    </div>
  )
}