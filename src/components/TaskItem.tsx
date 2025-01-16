import { TimeDropdown } from "@/components/TimeDropdown"
import { Button } from "@/components/ui/button"
import { type Task } from "@/types/task"
import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
  onAddChild?: (parentId: number) => void
  onRename: (id: number, newName: string) => void
  onReset?: (id: number) => void
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
  onReset,
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
        className={`flex rounded-lg border p-4 ${
          task.completed
            ? "bg-gray-100 opacity-75 dark:bg-gray-800"
            : task.timeRemaining === 0
              ? "border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
              : task.paused
                ? "bg-white dark:bg-gray-800"
                : "bg-white/80 dark:bg-gray-800/80"
        } ${isParent ? "border-amber-300 dark:border-gray-400" : ""}`}
      >
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-4">
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
              <>
                <span
                  onDoubleClick={handleDoubleClick}
                  className={`flex-1 cursor-text text-lg ${
                    task.completed
                      ? "text-gray-500 line-through dark:text-gray-400"
                      : isParent
                        ? "font-semibold text-gray-700 dark:text-gray-300"
                        : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {task.text}
                </span>
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

          {!isParent && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(task.id)}
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {task.completed ? "Undo" : "Done"}
              </button>
              {!task.completed && (
                <button
                  onClick={() => onPause(task.id)}
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {task.paused
                    ? task.timeRemaining === task.initialTimeRemaining
                      ? "Start"
                      : "Resume"
                    : "Pause"}
                </button>
              )}
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                Delete
              </button>
              {task.initialTimeRemaining !== task.timeRemaining && onReset && (
                <button
                  onClick={() => onReset(task.id)}
                  className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Reset
                </button>
              )}
              <span
                className="text-xs text-gray-500 dark:text-gray-400"
                title={`Created at ${formattedTime}`}
              >
                {!isParent && task.date}
              </span>
            </div>
          )}
        </div>
        {!isParent && (
          <div className="ml-4 flex items-center">
            <TimeDropdown
              timeRemaining={task.timeRemaining}
              onAdjust={(amount) => onTimeAdjust(task.id, amount)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
