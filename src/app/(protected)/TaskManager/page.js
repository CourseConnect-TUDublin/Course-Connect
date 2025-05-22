// src/app/TaskManager/page.js
"use client";
import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import useTaskManager from "./useTaskManager";
import TaskColumn from "./TaskColumn";
import { TaskAddForm, TaskEditDialog } from "./TaskForm";

export default function TaskManager() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.user?.sub;
  const {
    tasks, setTasks, newTask, setNewTask, editingTask, setEditingTask,
    searchTerm, setSearchTerm, sortOrder, setSortOrder,
    fetchTasks, handleAddTask, handleDeleteTask, handleArchiveTask,
    handleEditTask, handleSaveTask, filterAndSortTasks, onDragEnd,
  } = useTaskManager(userId);

  const filteredTasks = filterAndSortTasks(tasks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Task Manager
        </Typography>

        {/* Search/Sort + New Task Form */}
        <TaskAddForm newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={3}>
            {["red", "amber", "green"].map((status) => (
              <Grid item xs={12} md={4} key={status}>
                <TaskColumn
                  status={status}
                  tasks={filteredTasks[status]}
                  onDelete={handleDeleteTask}
                  onArchive={handleArchiveTask}
                  onEdit={handleEditTask}
                />
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Container>
      {/* Edit Modal */}
      <TaskEditDialog editingTask={editingTask} setEditingTask={setEditingTask} handleSaveTask={handleSaveTask} />
    </motion.div>
  );
}
