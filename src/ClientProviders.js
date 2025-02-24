// src/ClientProviders.js
"use client";

import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import theme from "./theme";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SessionProvider>
  );
}
