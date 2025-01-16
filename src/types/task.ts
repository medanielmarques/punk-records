export type Task = {
  id: number
  text: string
  timeRemaining: number | null // null for parent tasks
  initialTimeRemaining: number | null // null for parent tasks
  completed: boolean
  paused: boolean
  date: string
  timestamp: number // store exact creation time
  isParent?: boolean // whether this is a parent task
  parentId?: number | null // reference to parent task if this is a child
  children?: number[] // array of child task IDs
}
