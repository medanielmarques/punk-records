import { Task } from "@/types/task"

import { TaskItem } from "./TaskItem"

interface ActiveTasksProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
}

export function ActiveTasks({
  tasks,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
}: ActiveTasksProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
        Active Tasks
      </h2>
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
  )
}
