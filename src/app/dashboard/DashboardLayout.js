// src/app/dashboard/DashboardLayout.js
"use client";
import React, { useState } from "react";
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, Avatar, Button, Box } from "@mui/material";
import { Brightness4, Brightness7, Search, Notifications } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? "dark" : "light", primary: { main: "#1976d2" } },
      }),
    [darkMode]
  );
  const userName = session?.user?.email || "Guest";

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <CssBaseline />
        <AppBar position="fixed" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Course Connect
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => setDarkMode((m) => !m)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton onClick={() => router.push("/search")}><Search /></IconButton>
              <IconButton onClick={() => router.push("/notifications")}><Notifications /></IconButton>
              <Avatar sx={{ ml: 2 }} />
              <Typography sx={{ ml: 2, fontWeight: 600 }}>{userName}</Typography>
              <Button color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>Sign Out</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        {children}
      </Box>
    </ThemeProvider>
  );
}
