"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography, Grid, Skeleton, Box, Button } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import { useRouter } from "next/navigation";

export default function FlashcardPreview() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      try {
        const res = await fetch("/api/flashcards?limit=4");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setFlashcards(data.data);
      } catch (e) {
        setFlashcards([]);
      }
      setLoading(false);
    }
    fetchFlashcards();
  }, []);

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<QuizIcon color="primary" />}
        title="Flashcards Preview"
        sx={{ bgcolor: "#e6f0ff", pb: 0 }}
        action={
          <Button onClick={() => router.push("/flashcards")} size="small">
            See all
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={6} key={i}>
                  <Skeleton variant="rectangular" width="100%" height={60} />
                </Grid>
              ))
            : flashcards.length === 0
            ? (
              <Typography variant="body2" color="text.secondary">
                No flashcards found.
              </Typography>
            )
            : flashcards.map((fc) => (
                <Grid item xs={6} key={fc._id}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e3e3e3",
                      boxShadow: "0 2px 8px #0001",
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {fc.front}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fc.back.length > 30
                        ? fc.back.slice(0, 28) + "…"
                        : fc.back}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {fc.subject}
                    </Typography>
                  </Box>
                </Grid>
              ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
