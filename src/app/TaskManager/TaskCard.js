// /src/app/TaskManager/TaskCard.js
import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onComplete, onArchive, onEdit, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleSave = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  return (
    <div className={`taskCard ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="editForm">
          <input 
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <input 
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
          />
          <input 
            type="text"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input 
            type="text"
            value={editedTask.category}
            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
          />
          <input 
            type="text"
            value={editedTask.notes}
            onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
          />
          <input 
            type="text"
            value={editedTask.subtasks.join(', ')}
            onChange={(e) => setEditedTask({ 
              ...editedTask, 
              subtasks: e.target.value.split(',').map(s => s.trim()) 
            })}
          />
          <input 
            type="datetime-local"
            value={editedTask.reminder}
            onChange={(e) => setEditedTask({ ...editedTask, reminder: e.target.value })}
          />
          <div className="editActions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="taskContent">
            <h3 className="taskTitle">{task.title}</h3>
            <p className="taskDueDate">Due: {task.dueDate}</p>
            {task.description && <p className="taskDescription">{task.description}</p>}
            <p className="taskPriority">Priority: {task.priority}</p>
            {task.category && <p className="taskCategory">Category: {task.category}</p>}
            {task.notes && <p className="taskNotes">Notes: {task.notes}</p>}
            {task.subtasks && task.subtasks.length > 0 && (
              <ul className="subtasks">
                {task.subtasks.map((subtask, index) => (
                  <li key={index}>{subtask}</li>
                ))}
              </ul>
            )}
            {task.reminder && <p className="taskReminder">Reminder: {task.reminder}</p>}
          </div>
          <div className="taskActions">
            <button className="completeButton" onClick={() => onComplete(task.id)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button className="archiveButton" onClick={() => onArchive(task.id)}>
              Archive
            </button>
            <button className="editButton" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="shareButton" onClick={() => onShare(task.id)}>
              Share
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
