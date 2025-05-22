// src/app/dashboard/FlashcardPreview.js
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Button } from "@mui/material";

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box
      onClick={() => setFlipped((f) => !f)}
      sx={{
        width: "100%",
        height: 100,
        borderRadius: 2,
        boxShadow: 2,
        cursor: "pointer",
        perspective: "600px",
        mb: 1,
        position: "relative",
        background: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transition: "transform 0.5s",
          transform: flipped ? "rotateY(180deg)" : "none",
          backfaceVisibility: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 18,
          p: 2,
        }}
      >
        {flipped ? answer : question}
      </Box>
    </Box>
  );
}

export default function FlashcardPreview() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      try {
        const res = await fetch("/api/flashcards");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setFlashcards(data.data);
      } catch (err) {
        // Optionally handle errors
      }
      setLoading(false);
    }
    fetchFlashcards();
  }, []);

  if (loading) return <CircularProgress size={30} sx={{ my: 2 }} />;
  if (flashcards.length === 0)
    return <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>No flashcards yet.</Typography>;

  return (
    <Box>
      {flashcards.slice(0, 3).map((card, i) => (
        <Flashcard key={card._id || i} question={card.question} answer={card.answer} />
      ))}
      <Button fullWidth size="small" sx={{ mt: 1 }} variant="outlined" href="/flashcards">
        View All Flashcards
      </Button>
    </Box>
  );
}
