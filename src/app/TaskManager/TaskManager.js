"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskCreationForm from "./TaskCreationForm";
import TaskCard from "./TaskCard";
import ArchivePage from "./ArchivePage";
import AnalyticsReport from "./AnalyticsReport";
import "./TaskManager.css";
import { useSession, signIn } from "next-auth/react";

const TaskManager = () => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [calendarView, setCalendarView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  // New task form state (simplified)
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    description: "",
    priority: "Medium",
    category: "",
  });

  // Redirect or prompt login if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("No session, redirecting to login...");
      signIn();
    }
  }, [session, status]);

  // Fetch tasks from the API, filtering by userId.
  // IMPORTANT: Make sure your Task model (backend) includes a "userId" field.
  useEffect(() => {
    if (!session) return; // Wait until session is loaded
    const fetchTasks = async () => {
      try {
        const url = `/api/tasks?userId=${session.user.id}`;
        console.log("Fetching tasks from:", url);
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (result.success) {
          console.log("Fetched tasks for user:", session.user.id, result.data);
          setTasks(result.data);
        } else {
          toast.error("Failed to fetch tasks: " + result.error);
        }
      } catch (error) {
        toast.error("Error fetching tasks");
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [session]);

  // Reminder notifications logic (if you decide to add reminders later)
  const checkReminders = useCallback(() => {
    tasks.forEach((task) => {
      if (task.reminder) {
        const reminderTime = new Date(task.reminder).getTime();
        const now = Date.now();
        if (reminderTime - now > 0 && reminderTime - now < 60000) {
          toast.info(`Reminder: ${task.title} is due soon!`);
        }
      }
    });
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  // Add task function with API call
  const addTask = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("User not logged in");
      return;
    }
    if (!newTask.title.trim() || !newTask.dueDate) return;

    // Build payload with userId from session
    const payload = { ...newTask, userId: session.user.id, completed: false };
    console.log("Creating task with payload:", payload);

    // POST to API
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        console.log("Task created successfully:", result.data);
        // Append the new task from the database to state
        setTasks([...tasks, result.data]);
        setNewTask({
          title: "",
          dueDate: "",
          description: "",
          priority: "Medium",
          category: "",
        });
        toast.success("Task added successfully!");
      } else {
        toast.error("Failed to add task: " + result.error);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task");
    }
  };

  // Mark task as complete using local state update (update API similarly with a PUT request)
  const markTaskComplete = async (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id || task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Archive task: update local state and optionally call DELETE/PUT endpoint
  const archiveTask = async (id) => {
    const taskToArchive = tasks.find((task) => task.id === id || task._id === id);
    if (taskToArchive) {
      setArchivedTasks([...archivedTasks, taskToArchive]);
      setTasks(tasks.filter((task) => (task.id || task._id) !== id));
    }
  };

  const restoreTask = async (id) => {
    const taskToRestore = archivedTasks.find((task) => task.id === id || task._id === id);
    if (taskToRestore) {
      setTasks([...tasks, taskToRestore]);
      setArchivedTasks(archivedTasks.filter((task) => (task.id || task._id) !== id));
    }
  };

  // Edit task: update local state and optionally call API with PUT request.
  const editTask = async (id, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === id || task._id === id ? { ...task, ...updatedTask } : task
      )
    );
    toast.success("Task updated successfully!");
  };

  const shareTask = (id) => {
    const taskToShare = tasks.find((task) => task.id === id || task._id === id);
    if (taskToShare) {
      toast.info(`Sharing task: ${taskToShare.title}`);
    }
  };

  // Drag-and-drop functionality using dnd-kit
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(
      (task) => task.id === active.id || task._id === active.id
    );
    const newIndex = tasks.findIndex(
      (task) => task.id === over.id || task._id === over.id
    );
    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  // Filtering logic: match title or category (both lowercase)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics: progress tracking
  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  if (status === "loading" || !session) {
    return <p style={{ textAlign: "center", padding: "1rem" }}>Loading...</p>;
  }

  return (
    <div className="taskManagerContainer">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="taskManagerHeader">
        <div className="headerTop">
          <h2>{archivedTasks.length ? "Archived Tasks" : "Upcoming Tasks"}</h2>
          <div className="metrics">
            <span>
              {completedCount} / {tasks.length} tasks completed
            </span>
            <div className="progressBar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="headerButtons">
          <button onClick={() => setShowArchive(!showArchive)} className="toggleArchiveButton">
            {showArchive ? "View Tasks" : "View Archive"}
          </button>
          <button onClick={() => setCalendarView(!calendarView)} className="toggleCalendarButton">
            {calendarView ? "List View" : "Calendar View"}
          </button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className="toggleAnalyticsButton">
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
        </div>
      </header>

      {!showArchive && !showAnalytics && !calendarView && (
        <>
          <TaskCreationForm
            newTask={newTask}
            setNewTask={setNewTask}
            onSubmit={addTask}
          />
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </>
      )}

      {showArchive ? (
        <ArchivePage archivedTasks={archivedTasks} onRestore={restoreTask} />
      ) : calendarView ? (
        <div className="calendarView">
          <p>Calendar view coming soon!</p>
        </div>
      ) : showAnalytics ? (
        <AnalyticsReport tasks={tasks} />
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={filteredTasks.map((task, index) => task.id || task._id || index)}
            strategy={verticalListSortingStrategy}
          >
            <div className="taskList">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id || task._id || index}
                  task={task}
                  onComplete={markTaskComplete}
                  onArchive={archiveTask}
                  onEdit={editTask}
                  onShare={shareTask}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default TaskManager;
