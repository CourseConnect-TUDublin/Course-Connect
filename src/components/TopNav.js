// src/components/TopNav.js
"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

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
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user ? user.name : "Guest"}
        </Typography>
        {user ? (
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Sign Out
          </Button>
        ) : (
          <Button variant="outlined" color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
