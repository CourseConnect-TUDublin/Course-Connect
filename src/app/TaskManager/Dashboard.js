// /src/app/TaskManager/Dashboard.js
'use client';

import React from 'react';
import TaskManager from './TaskManager';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Tasks</li>
            <li>Calendar</li>
            <li>Analytics</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <div className="profile">
            <img src="/profile.jpg" alt="Profile" />
            <span>Student Name</span>
          </div>
        </header>
        <section className="content">
          {/* TaskManager is embedded into the dashboard */}
          <TaskManager />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
