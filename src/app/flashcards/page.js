"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  TextField,
  Divider,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, ArrowBack, ArrowForward, Flip } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function FlashcardsPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // New card inputs
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch cards from backend API
  useEffect(() => {
    setLoading(true);
    fetch("/api/flashcards")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCards(data.data);
        else if (Array.isArray(data)) setCards(data);
        else setCards([]);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  // --- Award XP/Points for flipping a flashcard ---
  const awardXPOnFlip = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          type: "FLASHCARD_FLIP", // match your rewards service
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          <span>
            <b>+5 XP!</b>
            <br />
            Flashcard reviewed
          </span>,
          {
            icon: "💡",
            style: { background: "#e1f7d5", color: "#222", fontWeight: 600 },
            duration: 2500,
          }
        );
        // Optionally, level up popup:
        if (data.user?.levelUp) {
          toast(
            <span>
              <b>🚀 Level Up!</b>
              <br />
              New level: {data.user.level}
            </span>,
            { icon: "🥇", duration: 3500 }
          );
        }
      }
    } catch {
      // Silent fail
    }
  };

  // Add card
  const addCard = async () => {
    const q = newQuestion.trim();
    const a = newAnswer.trim();
    if (!q || !a || !session?.user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, answer: a }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCards((prev) => [data.data, ...prev]);
        setNewQuestion("");
        setNewAnswer("");
        setCurrentIndex(0);
        setFlipped(false);

        // --- Award XP/Points for creating a flashcard ---
        await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            type: "CREATE_FLASHCARD",
          }),
        });
        toast.success("🎉 Flashcard created! +5 XP!");
      }
    } catch (err) {
      toast.error("Failed to create flashcard.");
    }
    setSaving(false);
  };

  // Helpers
  const shuffleCards = () => {
    let arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setCards(arr);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  };
  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  // Flip card and award XP
  const flipCard = () => {
    setFlipped((f) => !f);
    if (!flipped) {
      awardXPOnFlip(); // Only award on the initial flip to back
    }
  };

  const current = cards[currentIndex] || { question: "", answer: "" };

  // Animation variants
  const variants = {
    front: { rotateY: 0, transition: { duration: 0.6 } },
    back: { rotateY: 180, transition: { duration: 0.6 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
            Flashcards
          </Typography>

          {/* Controls */}
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <IconButton color="primary" onClick={prevCard} disabled={cards.length < 2}>
              <ArrowBack />
            </IconButton>
            <IconButton color="primary" onClick={flipCard}>
              <Flip />
            </IconButton>
            <IconButton color="primary" onClick={nextCard} disabled={cards.length < 2}>
              <ArrowForward />
            </IconButton>
            <IconButton color="secondary" onClick={shuffleCards}>
              <Shuffle />
            </IconButton>
          </Stack>

          {/* Card Display */}
          <Box sx={{ perspective: 1000, position: "relative", minHeight: 220 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            ) : cards.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No flashcards available. Add your first one below!
              </Typography>
            ) : (
              <motion.div
                variants={variants}
                animate={flipped ? "back" : "front"}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <Card
                  sx={{
                    minHeight: 200,
                    mb: 2,
                    position: "relative",
                    boxShadow: 6,
                    borderRadius: 3,
                    cursor: "pointer",
                    userSelect: "none",
                    background: "#FFF176",
                  }}
                  onClick={flipCard}
                >
                  <CardContent sx={{ backfaceVisibility: "hidden" }}>
                    <Typography variant="subtitle1" sx={{ color: "#0d47a1", fontWeight: 700 }}>
                      Q:
                    </Typography>
                    <Typography variant="h6" sx={{ minHeight: 64, fontWeight: 500 }}>
                      {current.question}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tap to flip
                    </Typography>
                  </CardContent>
                </Card>

                {/* Back Side */}
                <Card
                  sx={{
                    minHeight: 200,
                    mb: 2,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    boxShadow: 6,
                    borderRadius: 3,
                    cursor: "pointer",
                    userSelect: "none",
                    background: "#FFF176",
                  }}
                  onClick={flipCard}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                      A:
                    </Typography>
                    <Typography variant="h6" sx={{ minHeight: 64, fontWeight: 500 }}>
                      {current.answer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tap to flip
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Box>

          {/* Progress & Add New */}
          {cards.length > 0 && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {currentIndex + 1} / {cards.length}
              </Typography>
              <Button size="small" onClick={() => setCurrentIndex(0)}>
                Reset
              </Button>
            </Stack>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* New Card Form */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              addCard();
            }}
            sx={{ background: "#f5faff", p: 3, borderRadius: 3, boxShadow: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Add New Flashcard
            </Typography>
            <TextField
              label="New Question"
              fullWidth
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              sx={{ mb: 2 }}
              disabled={saving}
            />
            <TextField
              label="New Answer"
              fullWidth
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              sx={{ mb: 2 }}
              disabled={saving}
            />
            <Box textAlign="right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving || !session?.user?.id}
              >
                {saving ? "Saving..." : "Add Flashcard"}
              </Button>
            </Box>
          </Box>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}
