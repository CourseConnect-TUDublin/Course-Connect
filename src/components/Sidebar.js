"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
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
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const sidebarItems = [
  { label: "Home", route: "/home", icon: <Home /> },
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },

  // --- Gamification Features ---
  { label: "Rewards", route: "/rewards", icon: <CheckBox /> },
  { label: "Leaderboard", route: "/leaderboard", icon: <People /> },
  // { label: "Reward Store", route: "/rewards/store", icon: <StoreIcon /> }, // Optional

  { label: "Task Manager", route: "/TaskManager", icon: <Assignment /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday /> },
  { label: "Flashcards", route: "/flashcards", icon: <Assignment /> },
  { label: "Focus Timer", route: "/FocusTimer", icon: <CheckBox /> },
  { label: "Study Hub", route: "/studyhub", icon: <People /> },
  {
    label: "Study Tools",
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
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();

  const handleToggle = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <List>
      {sidebarItems.map((item) => (
        <React.Fragment key={item.label}>
          <ListItem disablePadding>
            {item.subItems ? (
              <ListItemButton
                onClick={() => handleToggle(item.label)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "inherit",
                  padding: "12px 16px",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {openMenu === item.label ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            ) : (
              <ListItemButton
                onClick={() => router.push(item.route)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "inherit",
                  padding: "12px 16px",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )}
          </ListItem>
          {item.subItems && (
            <Collapse in={openMenu === item.label} timeout="auto" unmountOnExit>
              {item.subItems.map((subItem) => (
                <ListItemButton
                  key={subItem.label}
                  sx={{
                    pl: 5,
                    textTransform: "none",
                    color: "inherit",
                    padding: "8px 16px",
                  }}
                  onClick={() => router.push(subItem.route)}
                >
                  <ListItemText primary={subItem.label} />
                </ListItemButton>
              ))}
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
