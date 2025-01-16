import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefObject } from "react"

interface TaskFormProps {
  newTask: string
  newTime: number
  onNewTaskChange: (value: string) => void
  onTimeAdjust: (amount: number) => void
  onSubmit: (e: React.FormEvent) => void
  inputRef: RefObject<HTMLInputElement>
}

export function TaskForm({
  newTask,
  newTime,
  onNewTaskChange,
  onTimeAdjust,
  onSubmit,
  inputRef,
}: TaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="mx-auto mb-8 flex max-w-[800px] gap-4">
      <Input
        ref={inputRef}
        type="text"
        value={newTask}
        onChange={(e) => onNewTaskChange(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={() => onTimeAdjust(-5)}
          variant="outline"
          className="px-4"
        >
          -
        </Button>
        <span className="w-16 text-center">{newTime} min</span>
        <Button
          type="button"
          onClick={() => onTimeAdjust(5)}
          variant="outline"
          className="px-4"
        >
          +
        </Button>
      </div>
      {/* <Button type="submit">Add Task</Button> */}
      <ThemeToggle />
    </form>
  )
}
