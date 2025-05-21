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
  const [other, setOther] = useState(null);
  const [loadingOther, setLoadingOther] = useState(true);

  // auth guard
  useEffect(() => {
    if (status === "authenticated" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!session) return null;

  const currentUserId   = session.user.id;
  const currentUserName = session.user.name || session.user.email;

  // parse room and auth
  const [idA, idB] = room.split("_");
  if (currentUserId !== idA && currentUserId !== idB) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          You’re not authorized to view this chat.
        </Typography>
      </Box>
    );
  }

  // identify the other user’s ID
  const otherId = currentUserId === idA ? idB : idA;

  // fetch other user’s profile
  useEffect(() => {
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
          {loadingOther
            ? "Loading…"
            : other?.name ?? "Unknown User"}
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
