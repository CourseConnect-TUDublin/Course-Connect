// src/components/TopNav.js
"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";

export default function TopNav({ currentUser }) {
  const router = useRouter();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: `240px`,
        backgroundColor: "white",
        color: "black",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Course Connect
        </Typography>
        <IconButton color="inherit">
          <Search />
        </IconButton>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <Typography variant="body1">
          {currentUser ? currentUser.name : "Guest"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
