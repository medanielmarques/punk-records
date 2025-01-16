"use client"

import { ActiveTasks } from "@/components/ActiveTasks"
import { CompletedTasks } from "@/components/CompletedTasks"
import { TaskForm } from "@/components/TaskForm"
import { useTasks } from "@/hooks/use-tasks"

export default function Toki() {
  const {
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
  } = useTasks()

  return (
    <div className="min-h-screen w-full bg-amber-50 p-8 dark:bg-gray-900">
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
          onReset={resetTask}
          newTaskText={newTask}
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
          onReset={resetTask}
        />
      </div>
    </div>
  )
}
