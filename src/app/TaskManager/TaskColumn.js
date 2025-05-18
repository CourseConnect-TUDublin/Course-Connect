// src/app/TaskManager/TaskColumn.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, tasks = [], onDelete, onEdit, onArchive }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color:
            status === "red"
              ? "#e53935"
              : status === "amber"
              ? "#fb8c00"
              : "#43a047",
        }}
      >
        {status === "red"
          ? "Red - Urgent"
          : status === "amber"
          ? "Amber - In Progress"
          : "Green - Completed"}
      </Typography>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 200,
              backgroundColor: snapshot.isDraggingOver ? "#f0f0f0" : "#fafafa",
              p: 2,
              borderRadius: 2,
              transition: "background-color 0.2s"
            }}
          >
            {(tasks || []).map((task, index) => (
              <TaskCard
                key={task._id || index}
                task={task}
                index={index}
                onDelete={onDelete}
                onArchive={onArchive}
                onEdit={onEdit}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
