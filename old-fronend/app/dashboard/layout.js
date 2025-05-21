// frontend/app/dashboard/layout.js
import "../globals.css";
import ClientProviders from "../ClientProviders";
import { CssBaseline, Box } from "@mui/material";

export const metadata = {
  title: "Course Connect - Dashboard",
  description: "Student Dashboard - Course Connect",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              mt: 8,
              px: { xs: 2, sm: 3 },
              pb: 4,
            }}
          >
            {children}
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
} 