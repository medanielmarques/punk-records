"use client"

import { ActiveTasks } from "@/components/ActiveTasks"
import { CompletedTasks } from "@/components/CompletedTasks"
import { Header } from "@/components/Header"
import { TaskForm } from "@/components/TaskForm"
import { getCurrentFormattedDate } from "@/lib/utils"
import { Task } from "@/types/task"
import { useEffect, useRef, useState } from "react"

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
    setNewTime(30)
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
          ? { ...task, children: [...(task.children || []), now] }
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

  return (
    <div className="min-h-screen w-full bg-amber-50 p-8 dark:bg-gray-900">
      <Header />

      <TaskForm
        newTask={newTask}
        newTime={newTime}
        onNewTaskChange={setNewTask}
        onTimeAdjust={adjustTime}
        onSubmit={handleAddTask}
        inputRef={inputRef}
      />

      <div className="mx-auto max-w-[800px] space-y-4">
        <ActiveTasks
          tasks={tasks.filter((task) => !task.completed)}
          onToggle={toggleTask}
          onPause={togglePause}
          onTimeAdjust={adjustTaskTime}
          onDelete={deleteTask}
          onAddChild={handleAddChildTask}
          onRename={renameTask}
        />

        <CompletedTasks
          tasks={tasks.filter((task) => task.completed)}
          allTasks={tasks}
          showCompleted={showCompleted}
          onToggleShow={setShowCompleted}
          onToggle={toggleTask}
          onPause={togglePause}
          onTimeAdjust={adjustTaskTime}
          onDelete={deleteTask}
          onRename={renameTask}
        />
      </div>
    </div>
  )
}
