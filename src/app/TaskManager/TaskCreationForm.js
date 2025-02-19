// /src/app/TaskManager/TaskCreationForm.js
import React, { useState } from 'react';
import './TaskCreationForm.css';

const TaskCreationForm = ({ newTask, setNewTask, onSubmit }) => {
  const [errors, setErrors] = useState({});

  // Basic validation: only title and due date are required.
  const validate = () => {
    const err = {};
    if (!newTask.title.trim()) {
      err.title = 'Task title is required';
    }
    if (!newTask.dueDate) {
      err.dueDate = 'Due date is required';
    }
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="addTaskForm">
      <div className="formRow">
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div className="formRow">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
        />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>
      <div className="formRow">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          placeholder="Enter description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>
      <div className="formRow">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>
      <div className="formRow">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          placeholder="Enter category (optional)"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        />
      </div>
      <button type="submit" className="submitButton">Add Task</button>
    </form>
  );
};

export default TaskCreationForm;
