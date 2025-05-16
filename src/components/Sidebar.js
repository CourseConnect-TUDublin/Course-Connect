// src/components/Sidebar.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { List, ListItem, Button, Popover, Typography, Box } from "@mui/material";
import {
  Home,
  Dashboard as DashboardIcon,
  Assignment,
  CalendarToday,
  CheckBox,
  People,
  Help,
  Settings,
  Archive as ArchiveIcon,
} from "@mui/icons-material";

const sidebarItems = [
  { label: "Home", route: "/home", icon: <Home /> },
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday /> },
  { label: "Flashcards", route: "/flashcards", icon: <Assignment /> },
  { label: "Focus Timer", route: "/FocusTimer", icon: <CheckBox /> },
  { label: "Study Hub", route: "/studyhub", icon: <People /> },
  {
    label: "Study Tools",
    route: "/studyhub",
    icon: <People />,
    subItems: [
      { label: "Study Buddy", route: "/StudyBuddy" },
      { label: "Chat Room", route: "/chatroom" },
      { label: "Calendar", route: "/calendar" },
    ],
  },
  { label: "Help Center", route: "/helpcenter", icon: <Help /> },
  { label: "Settings", route: "/settings", icon: <Settings /> },
  { label: "Archive", route: "/TaskManager/archive", icon: <ArchiveIcon /> },
];

export default function Sidebar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const handleMouseEnter = (event, item) => {
    if (item.subItems) {
      setAnchorEl(event.currentTarget);
      setActiveItem(item);
    }
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setActiveItem(null);
  };

  const open = Boolean(anchorEl);

  return (
    <List>
      {sidebarItems.map((item) => (
        <ListItem
          key={item.label}
          disablePadding
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            component={Link}
            href={item.route}
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
          {item.subItems && activeItem?.label === item.label && (
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleMouseLeave}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                onMouseEnter: () => setAnchorEl(anchorEl),
                onMouseLeave: handleMouseLeave,
                sx: { mt: 1 },
              }}
            >
              <Box>
                {item.subItems.map((subItem) => (
                  <Button
                    key={subItem.label}
                    component={Link}
                    href={subItem.route}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      padding: "8px 16px",
                    }}
                  >
                    {subItem.label}
                  </Button>
                ))}
              </Box>
            </Popover>
          )}
        </ListItem>
      ))}
    </List>
  );
}
