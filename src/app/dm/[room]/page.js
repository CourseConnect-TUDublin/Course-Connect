"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import Chat from "@/components/Chat";

export default function DMPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { room } = useParams();

  // Local state for the other user
  const [other, setOther] = useState(null);
  const [loadingOther, setLoadingOther] = useState(true);

  // Always declare hooks before any conditional logic
  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.name || session?.user?.email;

  // Parse IDs from the room string, but only if room exists
  const [idA, idB] = room ? room.split("_") : ["", ""];
  const authorized =
    currentUserId && (currentUserId === idA || currentUserId === idB);

  // Identify the other user's ID, only if authorized
  const otherId = authorized
    ? currentUserId === idA
      ? idB
      : idA
    : null;

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (status === "authenticated" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // Fetch other user's profile if authorized and otherId exists
  useEffect(() => {
    if (!otherId) return;
    let cancelled = false;
    (async () => {
      setLoadingOther(true);
      try {
        const res = await fetch(`/api/users/${otherId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setOther(data);
      } catch (err) {
        console.error("Failed to load other user:", err);
      } finally {
        if (!cancelled) setLoadingOther(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [otherId]);

  // Loading state for authentication
  if (status === "loading") {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated yet
  if (!session) return null;

  // Unauthorized access
  if (!authorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          You’re not authorized to view this chat.
        </Typography>
      </Box>
    );
  }

  // Main chat UI
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        {loadingOther ? (
          <CircularProgress size={24} />
        ) : (
          <Avatar src={other?.avatar}>
            {!other?.avatar && other?.name?.charAt(0)}
          </Avatar>
        )}
        <Typography variant="h6">
          {loadingOther ? "Loading…" : other?.name ?? "Unknown User"}
        </Typography>
      </Stack>

      {/* Chat */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Chat
          room={room}
          currentUser={currentUserName}
          currentUserId={currentUserId}
        />
      </Box>
    </Box>
  );
}
