// src/app/TaskManager/TaskForm.js
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Button,
  Grid, Typography, Paper
} from "@mui/material";

export function TaskEditDialog({ editingTask, setEditingTask, handleSaveTask }) {
  if (!editingTask) return null;
  return (
    <Dialog open={Boolean(editingTask)} onClose={() => setEditingTask(null)}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          fullWidth margin="dense"
          value={editingTask.title}
          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth margin="dense"
          value={editingTask.description}
          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
        />
        <TextField
          label="Due Date"
          name="dueDate"
          type="date"
          fullWidth margin="dense"
          InputLabelProps={{ shrink: true }}
          value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split("T")[0] : ""}
          onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={editingTask.status}
            label="Status"
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="amber">Amber</MenuItem>
            <MenuItem value="green">Green</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditingTask(null)}>Cancel</Button>
        <Button onClick={handleSaveTask} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export function TaskAddForm({ newTask, setNewTask, handleAddTask }) {
  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: "#fafafa" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Add New Task</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            label="Title" name="title" fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Description" name="description" fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Due Date" name="dueDate" type="date" fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newTask.status}
              label="Status"
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <MenuItem value="red">Red</MenuItem>
              <MenuItem value="amber">Amber</MenuItem>
              <MenuItem value="green">Green</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained" color="primary" fullWidth
            onClick={handleAddTask}
            sx={{ height: "100%" }}
          >Add</Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
