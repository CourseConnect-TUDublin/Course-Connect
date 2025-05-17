// src/app/TaskManager/useTaskManager.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export default function useTaskManager(userId) {
  const [tasks, setTasks] = useState({ red: [], amber: [], green: [] });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "red",
    dueDate: "",
    order: 0,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch tasks from backend API
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.success) {
        const grouped = { red: [], amber: [], green: [] };
        data.data.forEach((task) => {
          if (grouped[task.status]) {
            grouped[task.status].push(task);
          }
        });
        setTasks(grouped);
      } else {
        console.error("Failed to fetch tasks:", data.error);
        toast.error("Failed to fetch tasks.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks.");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add new task via backend API
  const handleAddTask = async () => {
    if (newTask.title.trim() === "") return;
    if (!newTask.dueDate) {
      alert("Due date is required!");
      return;
    }
    if (!userId) {
      alert("User information is still loading. Please try again.");
      return;
    }
    const columnTasks = tasks[newTask.status] || [];
    const order = columnTasks.length;
    const taskToAdd = {
      ...newTask,
      dueDate: new Date(newTask.dueDate).toISOString(),
      userId,
      order,
    };
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToAdd),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Task added successfully!");
        fetchTasks();
        setNewTask({ title: "", description: "", status: "red", dueDate: "", order: 0 });
      } else {
        console.error("Failed to add task:", data.error);
        toast.error("Failed to add task: " + data.error);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task.");
    }
  };

  // Delete task via backend API
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Task deleted successfully!");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task.");
    }
  };

  // Archive task (set archived to true)
  const handleArchiveTask = async (id) => {
    const taskToArchive = Object.values(tasks).flat().find((t) => t._id === id);
    if (!taskToArchive) return;
    const archivedTask = { ...taskToArchive, archived: true };
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(archivedTask),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Task archived successfully!");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error archiving task:", error);
      toast.error("Error archiving task.");
    }
  };

  // Open edit modal
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Save updated task via backend API
  const handleSaveTask = async () => {
    if (!editingTask) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTask),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Task updated successfully!");
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task.");
    }
  };

  // Filtering and sorting tasks
  const filterAndSortTasks = (tasksObj) => {
    const filtered = {};
    Object.keys(tasksObj).forEach((status) => {
      filtered[status] = tasksObj[status]
        .filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (a.order === undefined || b.order === undefined) return 0;
          return sortOrder === "asc" ? a.order - b.order : b.order - a.order;
        });
    });
    return filtered;
  };

  // Update backend order for tasks in a specific column
  const updateColumnOrder = async (status, items) => {
    for (let i = 0; i < items.length; i++) {
      const updatedTask = { ...items[i], order: i };
      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
      } catch (error) {
        console.error("Error updating task order:", error);
      }
    }
  };

  // Drag and drop handler
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      const items = reorder(tasks[source.droppableId], source.index, destination.index);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: items,
      }));
      await updateColumnOrder(source.droppableId, items);
      toast.success("Task order updated!");
    } else {
      const sourceItems = Array.from(tasks[source.droppableId]);
      const destinationItems = Array.from(tasks[destination.droppableId]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      movedItem.status = destination.droppableId;
      destinationItems.splice(destination.index, 0, movedItem);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems,
      }));
      await updateColumnOrder(source.droppableId, sourceItems);
      await updateColumnOrder(destination.droppableId, destinationItems);
      // Update moved task's status on the backend
      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movedItem),
        });
        toast.success("Task moved successfully!");
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Error updating task status.");
      }
    }
  };

  // Helper for reordering items in a list
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return {
    tasks,
    setTasks,
    newTask,
    setNewTask,
    editingTask,
    setEditingTask,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    fetchTasks,
    handleAddTask,
    handleDeleteTask,
    handleArchiveTask,
    handleEditTask,
    handleSaveTask,
    filterAndSortTasks,
    onDragEnd,
  };
}
