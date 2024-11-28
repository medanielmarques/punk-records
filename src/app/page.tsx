"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"

type Task = {
  id: number
  text: string
  timeRemaining: number
  completed: boolean
  paused: boolean
  date: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })
  const [newTask, setNewTask] = useState("")
  const [newTime, setNewTime] = useState(30) // Default 30 minutes
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
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
      (task) => !task.completed && !task.paused && task.timeRemaining > 0,
    )

    let timer: NodeJS.Timeout | undefined
    if (activeTask) {
      timer = setInterval(() => {
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((t) => {
            if (t.id === activeTask.id && t.timeRemaining > 0) {
              const newTime = t.timeRemaining - 1
              if (newTime === 0) {
                new Audio(
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

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const timeInSeconds = newTime * 60
    const today = new Date()
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear().toString().slice(-2)}`

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        timeRemaining: timeInSeconds,
        completed: false,
        paused: true,
        date: formattedDate,
      },
    ])
    setNewTask("")
    setNewTime(30)
    // Refocus input after adding task
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
        task.id === id
          ? {
              ...task,
              timeRemaining: Math.max(0, task.timeRemaining + amount * 60),
            }
          : task,
      ),
    )
    setOpenDropdownId(null)
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 p-8 dark:bg-gray-900">
      <div className="mb-12 flex items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200">
          tokitoki.app
        </h1>
        <ThemeToggle />
      </div>

      <form
        onSubmit={addTask}
        className="mb-12 flex flex-col items-center gap-6"
      >
        <Input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          className="w-full max-w-xl"
        />
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => adjustTime(-5)}
            variant="secondary"
            className="px-5 py-3 text-xl"
          >
            -5
          </Button>
          <span className="w-24 text-center text-2xl font-bold text-amber-800">
            {newTime} min
          </span>
          <Button
            type="button"
            onClick={() => adjustTime(5)}
            variant="secondary"
            className="px-5 py-3 text-xl"
          >
            +5
          </Button>
        </div>
      </form>

      <div className="mx-auto max-w-[800px] space-y-4">
        {/* Tarefas ativas */}
        {tasks
          .filter((task) => !task.completed)
          .map((task) => (
            <div
              key={task.id}
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
                  onCheckedChange={() => toggleTask(task.id)}
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
                  onClick={() => togglePause(task.id)}
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`font-mono text-xl ${
                        task.timeRemaining === 0
                          ? "text-red-500 dark:text-red-400"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {formatTime(task.timeRemaining)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => adjustTaskTime(task.id, 5)}
                    >
                      +5 min
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => adjustTaskTime(task.id, -5)}
                    >
                      -5 min
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                onClick={() => deleteTask(task.id)}
                variant="ghost"
                className="ml-6 text-2xl font-bold text-amber-300 hover:text-red-500 dark:text-amber-600 dark:hover:text-red-400"
              >
                ×
              </Button>
            </div>
          ))}

        {/* Seção de tarefas completadas */}
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showCompleted ? "▼" : "▶"} Tarefas concluídas (
            {tasks.filter((t) => t.completed).length})
          </button>

          {showCompleted && (
            <div className="mt-4 space-y-4">
              {tasks
                .filter((task) => task.completed)
                .map((task) => (
                  <div
                    key={task.id}
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
                        onCheckedChange={() => toggleTask(task.id)}
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
                        onClick={() => togglePause(task.id)}
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

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`font-mono text-xl ${
                              task.timeRemaining === 0
                                ? "text-red-500 dark:text-red-400"
                                : "text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {formatTime(task.timeRemaining)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => adjustTaskTime(task.id, 5)}
                          >
                            +5 min
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => adjustTaskTime(task.id, -5)}
                          >
                            -5 min
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Button
                      onClick={() => deleteTask(task.id)}
                      variant="ghost"
                      className="ml-6 text-2xl font-bold text-amber-300 hover:text-red-500 dark:text-amber-600 dark:hover:text-red-400"
                    >
                      ×
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
