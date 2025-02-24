"use client";

import React from "react";
import Link from "next/link";
import { List, ListItem, Button } from "@mui/material";
import {
  Home,
  Dashboard as DashboardIcon,
  Assignment,
  CalendarToday,
  CheckBox,
  People,
  Chat,
  Help,
  Settings,
  Archive as ArchiveIcon,
} from "@mui/icons-material";

const sidebarItems = [
  { label: "Home", route: "/home", icon: <Home /> },
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday /> },
  { label: "Assignments", route: "/assignments", icon: <Assignment /> },
  { label: "To-Do", route: "/todo", icon: <CheckBox /> },
  { label: "Study-Buddy", route: "/study-buddy", icon: <People /> },
  { label: "Chat Room", route: "/chatroom", icon: <Chat /> },
  { label: "Calendar", route: "/calendar", icon: <CalendarToday /> },
  { label: "Help Center", route: "/helpcenter", icon: <Help /> },
  { label: "Settings", route: "/settings", icon: <Settings /> },
  // Add the Archive link
  { label: "Archive", route: "/TaskManager/archive", icon: <ArchiveIcon /> },
];

export default function Sidebar() {
  return (
    <List>
      {sidebarItems.map((item) => (
        <ListItem key={item.label} disablePadding>
          <Link href={item.route} passHref legacyBehavior>
            <Button
              startIcon={item.icon}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                color: "inherit",
                padding: "12px 16px",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {item.label}
            </Button>
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
