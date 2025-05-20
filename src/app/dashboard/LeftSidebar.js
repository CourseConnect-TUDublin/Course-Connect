// src/app/dashboard/LeftSidebar.js
import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, Divider, Paper, Typography, Box
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import RewardsPanel from "./RewardsPanel";
import FlashcardPreview from "./FlashcardPreview";

export default function LeftSidebar({ router }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      try {
        const res = await fetch("/api/flashcards");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setFlashcards(data.data);
        } else {
          setFlashcards([]);
        }
      } catch {
        setFlashcards([]);
      }
      setLoading(false);
    }
    fetchFlashcards();
  }, []);

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader avatar={<TimerIcon />} title="Flashcards" />
        <Divider />
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading flashcards…
            </Typography>
          ) : (
            <FlashcardPreview cards={flashcards} />
          )}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { opacity: 0.7 },
              }}
              onClick={() => router.push("/flashcards")}
            >
              See all flashcards
            </Typography>
          </Box>
        </Box>
      </Card>
      <RewardsPanel />
    </>
  );
}
