import { type Task } from "@/types/task"

import { TaskItem } from "./TaskItem"
import { Button } from "./ui/button"

interface CompletedTasksProps {
  tasks: Task[]
  allTasks: Task[]
  showCompleted: boolean
  onToggleShow: (show: boolean) => void
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
  onRename: (id: number, newName: string) => void
  onReset: (id: number) => void
}

export function CompletedTasks({
  tasks,
  allTasks,
  showCompleted,
  onToggleShow,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
  onRename,
  onReset,
}: CompletedTasksProps) {
  if (tasks.length === 0) {
    return null
  }

  const findParentTask = (task: Task) => {
    if (!task.parentId) return null
    return allTasks.find((t) => t.id === task.parentId) ?? null
  }

  // Group tasks by parent
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const parentTask = findParentTask(task)
      const key = parentTask ? parentTask.id : "no-parent"
      if (!acc[key]) {
        acc[key] = {
          parent: parentTask,
          tasks: [],
        }
      }
      acc[key].tasks.push(task)
      return acc
    },
    {} as Record<string | number, { parent: Task | null; tasks: Task[] }>,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
          Done
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
        <div className="space-y-4">
          {Object.entries(groupedTasks).map(([key, group]) => (
            <div key={key} className="space-y-2">
              {group.parent && (
                <div className="w-fit rounded border border-amber-200 bg-amber-50/50 px-2 py-0.5 dark:border-amber-800 dark:bg-amber-900/30">
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {group.parent.text}
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {group.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onPause={onPause}
                    onTimeAdjust={onTimeAdjust}
                    onDelete={onDelete}
                    onRename={onRename}
                    onReset={onReset}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
