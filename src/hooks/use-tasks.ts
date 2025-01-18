import { getCurrentFormattedDate } from "@/lib/utils"
import { type Task } from "@/types/task"
import { useEffect, useRef, useState } from "react"

const DEFAULT_TASK_TIME = 10

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks")
      return savedTasks ? (JSON.parse(savedTasks) as Task[]) : []
    }
    return []
  })
  const [newTask, setNewTask] = useState("")
  const [newTime, setNewTime] = useState(DEFAULT_TASK_TIME)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Find the first active task
    const activeTask = tasks.find(
      (task) =>
        !task.completed &&
        !task.paused &&
        task.timeRemaining !== null &&
        task.timeRemaining > 0,
    )

    let timer: NodeJS.Timeout | undefined
    if (activeTask && activeTask.timeRemaining !== null) {
      timer = setInterval(() => {
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((t) => {
            if (
              t.id === activeTask.id &&
              t.timeRemaining !== null &&
              t.timeRemaining > 0
            ) {
              const newTime = t.timeRemaining - 1
              if (newTime === 0) {
                void new Audio(
                  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
                ).play()
              }
              return { ...t, timeRemaining: newTime }
            }
            return t
          }),
        )
      }, 1000)
    }

    return () => timer && clearInterval(timer)
  }, [tasks])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const timeInSeconds = newTime * 60
    const now = Date.now()

    // If the task starts with "+" it's a parent task
    const isParent = newTask.startsWith("+")
    const taskText = isParent ? newTask.slice(1).trim() : newTask

    setTasks([
      ...tasks,
      {
        id: now,
        text: taskText,
        timeRemaining: isParent ? null : timeInSeconds,
        initialTimeRemaining: isParent ? null : timeInSeconds,
        completed: false,
        paused: true,
        date: getCurrentFormattedDate(),
        timestamp: now,
        isParent,
        parentId: null,
        children: isParent ? [] : undefined,
      },
    ])
    setNewTask("")
    setNewTime(DEFAULT_TASK_TIME)
    inputRef.current?.focus()
  }

  const handleAddChildTask = (parentId: number) => {
    if (!newTask.trim()) return

    const timeInSeconds = newTime * 60
    const now = Date.now()

    setTasks((prevTasks) => {
      const newTasks = [
        ...prevTasks,
        {
          id: now,
          text: newTask,
          timeRemaining: timeInSeconds,
          initialTimeRemaining: timeInSeconds,
          completed: false,
          paused: true,
          date: getCurrentFormattedDate(),
          timestamp: now,
          isParent: false,
          parentId,
        },
      ]

      // Update parent's children array
      return newTasks.map((task) =>
        task.id === parentId
          ? { ...task, children: [...(task.children ?? []), now] }
          : task,
      )
    })

    setNewTask("")
    setNewTime(30)
    inputRef.current?.focus()
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, paused: true }
          : task,
      ),
    )
  }

  const togglePause = (id: number) => {
    setTasks(
      tasks.map(
        (task) =>
          task.id === id
            ? { ...task, paused: !task.paused }
            : { ...task, paused: true }, // Pause all other tasks
      ),
    )
  }

  const adjustTime = (amount: number) => {
    setNewTime((prev) => Math.max(5, prev + amount))
  }

  const adjustTaskTime = (id: number, amount: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id && task.timeRemaining !== null
          ? {
              ...task,
              timeRemaining: Math.max(0, task.timeRemaining + amount * 60),
              initialTimeRemaining: Math.max(
                0,
                task.timeRemaining + amount * 60,
              ),
            }
          : task,
      ),
    )
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const renameTask = (id: number, newName: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newName } : task)),
    )
  }

  const resetTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id && task.initialTimeRemaining !== null
          ? { ...task, timeRemaining: task.initialTimeRemaining, paused: true }
          : task,
      ),
    )
  }

  return {
    tasks,
    newTask,
    newTime,
    inputRef,
    showCompleted,
    handleAddTask,
    handleAddChildTask,
    toggleTask,
    togglePause,
    adjustTime,
    adjustTaskTime,
    deleteTask,
    renameTask,
    resetTask,
    setShowCompleted,
    setNewTask,
    setNewTime,
  }
}
