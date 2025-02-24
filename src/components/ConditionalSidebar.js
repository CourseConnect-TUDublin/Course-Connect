// src/components/ConditionalSidebar.js
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();

  // If the current route is "/home" (or starts with "/home"), hide the sidebar.
  if (pathname === "/home" || pathname.startsWith("/home/")) {
    return null;
  }

  return <Sidebar />;
}
