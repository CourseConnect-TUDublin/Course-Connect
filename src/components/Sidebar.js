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
        {[
          "Home",
          "Dashboard",
          "Timetable",
          "Assignments",
          "To-Do",
          "Study-Buddy",
          "Chat Room",
          "Calendar",
          "Help Center",
          "Settings",
        ].map((text, index) => (
          <ListItem
            key={text}
            component={Link}
            href={
              text === "Home"
                ? "/dashboard" // Home now redirects to dashboard
                : text === "Timetable"
                ? "/timetable"
                : text.toLowerCase().replace(/\s+/g, "")
            }
            sx={{ textDecoration: "none", color: "white" }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {index === 0 ? <Home /> :
               index === 1 ? <DashboardIcon /> :
               index === 2 ? <CalendarToday /> :
               index === 3 ? <Assignment /> :
               index === 4 ? <CheckBox /> :
               index === 5 ? <People /> :
               index === 6 ? <Chat /> :
               index === 7 ? <CalendarToday /> :
               index === 8 ? <Help /> : <Settings />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
