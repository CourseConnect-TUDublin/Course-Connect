// src/app/layout.js
import "./globals.css";
import ClientProviders from "../ClientProviders";
import Header from "../components/Header";
import ConditionalSidebar from "../components/ConditionalSidebar";
import { CssBaseline, Box, Drawer, Toolbar } from "@mui/material";

const drawerWidth = 240;

export const metadata = {
  title: "Course Connect",
  description: "Modern Course Connect Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <CssBaseline />
          <Box sx={{ display: "flex" }}>
            {/* Permanent Sidebar is now conditionally rendered */}
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  backgroundColor: "#ffffff", // light background
                  color: "#000000",
                  borderRight: "1px solid #eaeaea",
                },
              }}
            >
              <Toolbar />
              <ConditionalSidebar />
            </Drawer>

            {/* Main Content Area */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 2, sm: 3, md: 4 },
                ml: `${drawerWidth}px`,
              }}
            >
              {/* Header for pages using the global layout */}
              <Header drawerWidth={drawerWidth} />
              <Toolbar />
              {children}
            </Box>
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}
