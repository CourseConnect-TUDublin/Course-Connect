// src/app/TaskManager/TaskCard.js
import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Archive as ArchiveIcon } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";

export default function TaskCard({ task, index, onDelete, onEdit, onArchive }) {
  let borderColor, bgColor;
  switch (task.status) {
    case "red":
      borderColor = "#e53935"; bgColor = "#ffebee"; break;
    case "amber":
      borderColor = "#fb8c00"; bgColor = "#fff3e0"; break;
    case "green":
      borderColor = "#43a047"; bgColor = "#e8f5e9"; break;
    default:
      borderColor = "#cccccc"; bgColor = "#ffffff";
  }
  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            p: 2, mb: 2,
            borderLeft: `5px solid ${borderColor}`,
            backgroundColor: bgColor,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{task.title}</Typography>
            <Box>
              <IconButton size="small" onClick={() => onEdit(task)}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => onDelete(task._id)}><DeleteIcon fontSize="small" /></IconButton>
              {task.status === "green" && <IconButton size="small" onClick={() => onArchive(task._id)}><ArchiveIcon fontSize="small" /></IconButton>}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">{task.description}</Typography>
          {task.dueDate && <Typography variant="caption" color="text.secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>}
        </Paper>
      )}
    </Draggable>
  );
}
