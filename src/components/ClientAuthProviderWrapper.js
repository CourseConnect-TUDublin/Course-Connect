// src/components/ClientAuthProviderWrapper.js
"use client";

import { AuthProvider } from "../context/AuthContext";

export default function ClientAuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
