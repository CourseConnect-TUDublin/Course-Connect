import Providers from "./providers"; // Wraps everything in SessionProvider
import { CssBaseline, Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export const metadata = {
  title: "Course Connect",
  description: "University Timetable Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* Global head elements */}</head>
      <body>
        <CssBaseline />
        <Providers>
          <Box sx={{ display: "flex" }}>
            {/* Global Sidebar renders on every page */}
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
