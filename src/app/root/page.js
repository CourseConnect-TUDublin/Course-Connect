"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function RootClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to resolve
    if (!session) router.replace("/login");
    else router.replace("/dashboard");
  }, [session, status, router]);

  //  show a spinner while loading
  return (
    <Box sx={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <CircularProgress />
    </Box>
  );
}
