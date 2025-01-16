import { TaskItem } from "@/components/TaskItem"
import { type Task } from "@/types/task"

interface ActiveTasksProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onPause: (id: number) => void
  onTimeAdjust: (id: number, amount: number) => void
  onDelete: (id: number) => void
  onAddChild?: (parentId: number) => void
  onRename: (id: number, newName: string) => void
  onReset: (id: number) => void
  newTaskText: string
}

export function ActiveTasks({
  tasks,
  onToggle,
  onPause,
  onTimeAdjust,
  onDelete,
  onAddChild,
  onRename,
  onReset,
  newTaskText,
}: ActiveTasksProps) {
  if (tasks.length === 0) {
    return null
  }

  // Separate parent and orphan tasks
  const parentTasks = tasks.filter((task) => task.isParent)
  const orphanTasks = tasks.filter((task) => !task.isParent && !task.parentId)

  // Get child tasks for a parent
  const getChildTasks = (parentId: number) =>
    tasks.filter((task) => task.parentId === parentId)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
        To-Do
      </h2>

      {/* Parent tasks with their children */}
      {parentTasks.map((parent) => (
        <div key={parent.id} className="space-y-2">
          <TaskItem
            task={parent}
            onToggle={onToggle}
            onPause={onPause}
            onTimeAdjust={onTimeAdjust}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onRename={onRename}
            isParent
            newTaskText={newTaskText}
          />
          <div className="ml-6 space-y-2 border-l-2 border-amber-200 pl-4">
            {getChildTasks(parent.id).map((child) => (
              <TaskItem
                key={child.id}
                task={child}
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

      {/* Orphan tasks */}
      {orphanTasks.map((task) => (
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
  )
}
