"use client";
import React, { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import MainLayout from "./MainLayout";
import ClientProviders from "../ClientProviders";

export default function SplashWrapper({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 2 seconds splash
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <ClientProviders>
      <MainLayout drawerWidth={240}>{children}</MainLayout>
    </ClientProviders>
  );
}
