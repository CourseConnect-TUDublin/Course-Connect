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

  // XP AWARD FUNCTION
  async function awardXP(amount = 10) {
    try {
      const res = await fetch("/api/xp/gain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`+${amount} XP for completing a task!`);
        // Optionally, trigger a user data refresh or update profile
      } else {
        toast.error("Failed to award XP");
      }
    } catch {
      toast.error("Error awarding XP");
    }
  }

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
        toast.error("Failed to fetch tasks.");
      }
    } catch {
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
        toast.error("Failed to add task: " + data.error);
      }
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Error archiving task.");
    }
  };

  // Open edit modal
  const handleEditTask = (task) => setEditingTask(task);

  // Save updated task via backend API (and check for XP)
  const handleSaveTask = async () => {
    if (!editingTask) return;
    // Get original status before editing
    const originalTask = Object.values(tasks).flat().find((t) => t._id === editingTask._id);
    const wasNotCompleted = originalTask?.status !== "green";
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
        // Award XP if status changed to completed
        if (editingTask.status === "green" && wasNotCompleted) {
          await awardXP(10); // Award 10 XP (or set your value)
        }
      }
    } catch {
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
      } catch {}
    }
  };

  // Drag and drop handler (with XP integration)
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
      const wasNotCompleted = movedItem.status !== "green";
      movedItem.status = destination.droppableId;
      destinationItems.splice(destination.index, 0, movedItem);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems,
      }));
      await updateColumnOrder(source.droppableId, sourceItems);
      await updateColumnOrder(destination.droppableId, destinationItems);
      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movedItem),
        });
        // Award XP only if now moved to green and wasn't before
        if (movedItem.status === "green" && wasNotCompleted) {
          await awardXP(10); // or your chosen value
        }
        toast.success("Task moved successfully!");
      } catch {
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
