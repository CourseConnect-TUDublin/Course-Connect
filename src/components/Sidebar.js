// src/components/Sidebar.js
"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  useTheme,
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
} from "@mui/icons-material";

// Sidebar sections for clarity
const sidebarSections = [
  {
    label: "Overview",
    items: [
      { label: "Home", route: "/home", icon: <Home /> },
      { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
    ],
  },
  {
    label: "Productivity",
    items: [
      { label: "Task Manager", route: "/TaskManager", icon: <Assignment /> },
      { label: "Timetable", route: "/timetable", icon: <CalendarToday /> },
      { label: "Flashcards", route: "/flashcards", icon: <Assignment /> },
      { label: "Focus Timer", route: "/FocusTimer", icon: <CheckBox /> },
      // Study Hub and Study Tools (Study Buddy, Chat Room) removed
    ],
  },
  {
    label: "Gamification",
    items: [
      { label: "Rewards", route: "/rewards", icon: <CheckBox /> },
      { label: "Leaderboard", route: "/leaderboard", icon: <People /> },
      // { label: "Reward Store", route: "/rewards/store", icon: <StoreIcon /> },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Help Center", route: "/helpcenter", icon: <Help /> },
      { label: "Settings", route: "/settings", icon: <Settings /> },
      { label: "Archive", route: "/TaskManager/archive", icon: <ArchiveIcon /> },
    ],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  // Helper for active highlighting
  const isActive = (route) => route && pathname && pathname.startsWith(route);

  return (
    <List sx={{ py: 2, px: 1 }}>
      {sidebarSections.map((section, i) => (
        <React.Fragment key={section.label}>
          {/* Section Title */}
          <Typography
            variant="caption"
            sx={{
              pl: 2,
              pb: 0.5,
              pt: i > 0 ? 2 : 0,
              color: theme.palette.mode === "dark" ? "#aaa" : "#888",
              letterSpacing: 1.2,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {section.label}
          </Typography>
          {section.items.map((item) => (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(item.route)}
                  selected={isActive(item.route)}
                  sx={{
                    borderLeft: isActive(item.route)
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                    bgcolor: isActive(item.route)
                      ? `${theme.palette.primary.main}10`
                      : "transparent",
                    color: isActive(item.route)
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontWeight: isActive(item.route) ? 700 : 500,
                    py: 1.1,
                    pl: 2,
                    pr: 1.5,
                    "&:hover": {
                      bgcolor: `${theme.palette.primary.main}15`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.route) ? 700 : 600,
                      fontSize: 15,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
          {/* Divider after each section except last */}
          {i < sidebarSections.length - 1 && (
            <Divider sx={{ my: 1.3, opacity: 0.14 }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
