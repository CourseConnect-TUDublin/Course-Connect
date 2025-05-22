"use client";

import React, { useState, useMemo } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Search,
  Notifications,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#1976d2" },
        },
      }),
    [darkMode]
  );

  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <CssBaseline />
        <AppBar position="fixed" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Course Connect
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: isMobile ? 1 : 0,
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-end",
              }}
            >
              <IconButton onClick={() => setDarkMode((prev) => !prev)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              <IconButton onClick={() => router.push("/search")}>
                <Search />
              </IconButton>

              <IconButton onClick={() => router.push("/notifications")}>
                <Notifications />
              </IconButton>

              <Avatar sx={{ ml: 2 }}>{userInitial}</Avatar>

              {!isMobile && (
                <Typography sx={{ ml: 2, fontWeight: 600 }}>
                  {userName}
                </Typography>
              )}

              <Button
                color="inherit"
                onClick={() => signOut({ callbackUrl: "/login" })}
                sx={{ ml: 2, mt: isMobile ? 1 : 0 }}
              >
                Sign Out
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Spacer to push content below AppBar */}
        <Toolbar />

        {/* Main Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}
