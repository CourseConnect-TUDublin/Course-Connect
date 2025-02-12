// src/components/TopNav.js
"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const router = useRouter();
  const { user } = useAuth();

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
          {user ? user.name : "Guest"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
