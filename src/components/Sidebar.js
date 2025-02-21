// src/components/Sidebar.js
import Link from "next/link";
import { Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  Home,
  Dashboard as DashboardIcon,
  CalendarToday,
  Assignment,
  CheckBox,
  People,
  Chat,
  Help,
  Settings,
} from "@mui/icons-material";

const drawerWidth = 240;

// Define your sidebar items here. Adjust routes as needed.
const sidebarItems = [
  { label: "Home", route: "/dashboard", icon: <Home /> },
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment /> }, // Task Manager navigation
  { label: "Timetable", route: "/timetable", icon: <CalendarToday /> },
  { label: "Assignments", route: "/assignments", icon: <Assignment /> },
  { label: "To-Do", route: "/todo", icon: <CheckBox /> },
  { label: "Study-Buddy", route: "/study-buddy", icon: <People /> },
  { label: "Chat Room", route: "/chatroom", icon: <Chat /> },
  { label: "Calendar", route: "/calendar", icon: <CalendarToday /> },
  { label: "Help Center", route: "/helpcenter", icon: <Help /> },
  { label: "Settings", route: "/settings", icon: <Settings /> },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#2D2D3A",
          color: "white",
        },
      }}
    >
      <Toolbar />
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            href={item.route}
            sx={{ textDecoration: "none", color: "white" }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
