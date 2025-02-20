import Providers from "./providers"; // ✅ Ensure SessionProvider is here
import { CssBaseline, Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export const metadata = {
  title: "Course Connect",
  description: "University Timetable Application"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* global head elements */}</head>
      <body>
        <CssBaseline />
        <Providers> {/* ✅ Wrap Everything in SessionProvider */}
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
              <TopNav />
              <Toolbar />
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
