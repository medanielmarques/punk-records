"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState(30); // Default 30 minutes
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Find the first active task
    const activeTask = tasks.find(
      (task) => !task.completed && !task.paused && task.timeRemaining > 0,
    );

    let timer;
    if (activeTask) {
      timer = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id === activeTask.id && t.timeRemaining > 0) {
              const newTime = t.timeRemaining - 1;
              if (newTime === 0) {
                new Audio(
                  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
                ).play();
              }
              return { ...t, timeRemaining: newTime };
            }
            return t;
          }),
        );
      }, 1000);
    }

    return () => timer && clearInterval(timer);
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const timeInSeconds = newTime * 60;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        timeRemaining: timeInSeconds,
        completed: false,
        paused: true, // Start paused
      },
    ]);
    setNewTask("");
    setNewTime(30);
    // Refocus input after adding task
    inputRef.current?.focus();
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const togglePause = (id) => {
    setTasks(
      tasks.map(
        (task) =>
          task.id === id
            ? { ...task, paused: !task.paused }
            : { ...task, paused: true }, // Pause all other tasks
      ),
    );
  };

  const adjustTime = (amount) => {
    setNewTime((prev) => Math.max(5, prev + amount));
  };

  const adjustTaskTime = (id, amount) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              timeRemaining: Math.max(0, task.timeRemaining + amount * 60),
            }
          : task,
      ),
    );
    setOpenDropdownId(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 p-8">
      <h1 className="mb-12 text-center text-4xl font-bold text-amber-800">
        tokitoki.app
      </h1>

      <form
        onSubmit={addTask}
        className="mb-12 flex flex-col items-center gap-6"
      >
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          className="w-full max-w-xl rounded-lg border bg-white/50 px-6 py-3 text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => adjustTime(-5)}
            className="rounded-lg bg-amber-200 px-5 py-3 text-xl font-medium text-amber-700 transition-colors hover:bg-amber-300"
          >
            -5
          </button>
          <span className="w-24 text-center text-2xl font-bold text-amber-800">
            {newTime} min
          </span>
          <button
            type="button"
            onClick={() => adjustTime(5)}
            className="rounded-lg bg-amber-200 px-5 py-3 text-xl font-medium text-amber-700 transition-colors hover:bg-amber-300"
          >
            +5
          </button>
        </div>
      </form>

      <div className="mx-auto max-w-[800px] space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between rounded-lg border p-6 ${
              task.completed
                ? "bg-gray-100 opacity-75"
                : task.timeRemaining === 0
                  ? "border-red-200 bg-red-50"
                  : task.paused
                    ? "bg-amber-50"
                    : "bg-amber-50/70"
            }`}
          >
            <div className="flex flex-1 items-center gap-6">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-6 w-6 rounded border-amber-300 focus:ring-amber-500"
              />
              <span
                className={`flex-1 text-lg ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-amber-900"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => togglePause(task.id)}
                className={`rounded px-4 py-2 text-lg ${
                  task.paused
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-200 text-amber-700"
                }`}
              >
                {task.paused ? "Start" : "Pause"}
              </button>
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === task.id ? null : task.id,
                    )
                  }
                  className={`font-mono text-xl ${
                    task.timeRemaining === 0 ? "text-red-500" : "text-amber-700"
                  }`}
                >
                  {formatTime(task.timeRemaining)}
                </button>
                {openDropdownId === task.id && (
                  <div className="absolute right-0 mt-2 rounded-lg border border-amber-100 bg-white py-2 shadow-lg">
                    <button
                      onClick={() => adjustTaskTime(task.id, 5)}
                      className="block w-full px-4 py-2 text-left hover:bg-amber-50"
                    >
                      +5 min
                    </button>
                    <button
                      onClick={() => adjustTaskTime(task.id, -5)}
                      className="block w-full px-4 py-2 text-left hover:bg-amber-50"
                    >
                      -5 min
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-6 text-2xl font-bold text-amber-300 transition-colors hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
