// /src/app/TaskManager/TaskManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskCreationForm from './TaskCreationForm';
import TaskCard from './TaskCard';
import ArchivePage from './ArchivePage';
import AnalyticsReport from './AnalyticsReport';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [calendarView, setCalendarView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // New task form state (simplified)
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    description: '',
    priority: 'Medium',
    category: ''
  });

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const result = await response.json();
        if (result.success) {
          setTasks(result.data);
        } else {
          toast.error('Failed to fetch tasks');
        }
      } catch (error) {
        toast.error('Error fetching tasks');
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Reminder notifications logic (if you decide to add reminders later)
  const checkReminders = useCallback(() => {
    tasks.forEach(task => {
      if (task.reminder) { // In this simplified version, reminders might be omitted
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

  // Add task function passed to TaskCreationForm
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.dueDate) return;
    const task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false
    };

    // Optionally, you can POST this new task to your API here.
    // For now we'll update local state and show a success message.
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      dueDate: '',
      description: '',
      priority: 'Medium',
      category: ''
    });
    toast.success('Task added successfully!');
  };

  const markTaskComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id || task._id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const archiveTask = (id) => {
    const taskToArchive = tasks.find(task => task.id === id || task._id === id);
    if (taskToArchive) {
      setArchivedTasks([...archivedTasks, taskToArchive]);
      setTasks(tasks.filter(task => (task.id || task._id) !== id));
    }
  };

  const restoreTask = (id) => {
    const taskToRestore = archivedTasks.find(task => task.id === id || task._id === id);
    if (taskToRestore) {
      setTasks([...tasks, taskToRestore]);
      setArchivedTasks(archivedTasks.filter(task => (task.id || task._id) !== id));
    }
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => (task.id === id || task._id === id) ? { ...task, ...updatedTask } : task));
    toast.success('Task updated successfully!');
  };

  const shareTask = (id) => {
    const taskToShare = tasks.find(task => task.id === id || task._id === id);
    if (taskToShare) {
      toast.info(`Sharing task: ${taskToShare.title}`);
    }
  };

  // Drag-and-drop functionality using dnd-kit
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(task => task.id === active.id || task._id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id || task._id === over.id);
    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  // Filtering logic: match title or category (both converted to lowercase)
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics: progress tracking
  const completedCount = tasks.filter(task => task.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="taskManagerContainer">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="taskManagerHeader">
        <div className="headerTop">
          <h2>{showArchive ? 'Archived Tasks' : 'Upcoming Tasks'}</h2>
          <div className="metrics">
            <span>{completedCount} / {tasks.length} tasks completed</span>
            <div className="progressBar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="headerButtons">
          <button onClick={() => setShowArchive(!showArchive)} className="toggleArchiveButton">
            {showArchive ? 'View Tasks' : 'View Archive'}
          </button>
          <button onClick={() => setCalendarView(!calendarView)} className="toggleCalendarButton">
            {calendarView ? 'List View' : 'Calendar View'}
          </button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className="toggleAnalyticsButton">
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
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
          <SortableContext items={filteredTasks.map(task => task.id || task._id)} strategy={verticalListSortingStrategy}>
            <div className="taskList">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id || task._id}
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
