// /src/app/TaskManager/ArchivePage.js
import React from 'react';
import './ArchivePage.css';

const ArchivePage = ({ archivedTasks, onRestore }) => {
  return (
    <div className="archiveContainer">
      {archivedTasks.length === 0 ? (
        <p>No archived tasks.</p>
      ) : (
        archivedTasks.map(task => (
          <div key={task.id || task._id} className="archivedTaskCard">
            <h3>{task.title}</h3>
            <p>Due: {task.dueDate}</p>
            <button onClick={() => onRestore(task.id || task._id)}>Restore</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ArchivePage;
