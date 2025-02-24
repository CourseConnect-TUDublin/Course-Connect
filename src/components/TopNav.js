"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";

export default function TopNav() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Log session data when it changes
  useEffect(() => {
    console.log("TopNav session:", session);
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
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
          {status === "authenticated" ? session.user.email : "Guest"}
        </Typography>
        {status === "authenticated" ? (
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
