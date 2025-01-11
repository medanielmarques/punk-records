import { TimeDropdown } from "@/components/TimeDropdown"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/types/task"
import { format } from "date-fns"
import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
  onAddChild?: (parentId: number) => void
  onRename: (id: number, newName: string) => void
  isParent?: boolean
  parentTask?: Task | null
}

export function TaskItem({
  task,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
  onAddChild,
  onRename,
  isParent,
  parentTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(task.text)
  const inputRef = useRef<HTMLInputElement>(null)

  const formattedTime = task.timestamp
    ? format(new Date(task.timestamp), "h:mm a")
    : ""

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    if (editedText.trim() && editedText !== task.text) {
      onRename(task.id, editedText.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setEditedText(task.text)
      setIsEditing(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  return (
    <div className="relative">
      {task.completed && parentTask && (
        <div className="">
          <div className="w-fit rounded border border-amber-200 bg-amber-50/50 px-2 py-0.5 dark:border-amber-800 dark:bg-amber-900/30">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {parentTask.text}
            </span>
          </div>
        </div>
      )}
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
          {isEditing ? (
            <input
              ref={inputRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded border px-2 py-1 text-lg focus:outline-amber-500"
            />
          ) : (
            <span
              onDoubleClick={handleDoubleClick}
              className={`flex-1 cursor-text text-lg ${
                task.completed
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : isParent
                    ? "font-semibold text-amber-700 dark:text-amber-300"
                    : "text-amber-900 dark:text-amber-100"
              }`}
            >
              {task.text}
            </span>
          )}
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
    </div>
  )
}
