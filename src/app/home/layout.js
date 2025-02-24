// src/app/home/layout.js
import "../globals.css";
import ClientProviders from "../../ClientProviders";
import Header from "../../components/Header";
import { CssBaseline, Box } from "@mui/material";

export const metadata = {
  title: "Course Connect - Home",
  description: "Welcome page for Course Connect",
};

export default function HomeLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <CssBaseline />
          {/* Header remains here */}
          <Header />
          {/* Main Content Area without sidebar */}
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
