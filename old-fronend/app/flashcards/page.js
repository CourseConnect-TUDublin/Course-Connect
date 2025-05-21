"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  TextField,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Undo, ArrowBack, ArrowForward, Flip } from '@mui/icons-material';

export default function FlashcardsPage() {
  // Default flashcards
  const defaultCards = [
    { question: "Define Pythagoras' theorem.", answer: "In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides." },
    { question: "Capital of Ireland?", answer: "Dublin." },
    { question: "Newton's 2nd Law?", answer: "Force equals mass times acceleration (F = m * a)." },
  ];

  // Load cards from localStorage or defaults
  const [cards, setCards] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flashcards');
      if (saved) return JSON.parse(saved);
    }
    return defaultCards;
  });

  // Persist cards
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flashcards', JSON.stringify(cards));
    }
  }, [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // New card inputs
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Helpers
  const addCard = () => {
    const q = newQuestion.trim();
    const a = newAnswer.trim();
    if (!q || !a) return;
    setCards(prev => [...prev, { question: q, answer: a }]);
    setNewQuestion(''); setNewAnswer('');
    setCurrentIndex(cards.length);
    setFlipped(false);
  };

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

  const nextCard = () => { setFlipped(false); setCurrentIndex((i) => (i + 1) % cards.length); };
  const prevCard = () => { setFlipped(false); setCurrentIndex((i) => (i - 1 + cards.length) % cards.length); };
  const flipCard = () => { setFlipped(f => !f); };

  const current = cards[currentIndex] || { question: '', answer: '' };

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
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
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
          <Box sx={{ perspective: 1000 }}>
            <motion.div
              variants={variants}
              animate={flipped ? 'back' : 'front'}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <Card sx={{ minHeight: 200, mb: 2, position: 'relative' }}>
                <CardContent sx={{ backfaceVisibility: 'hidden' }}>
                  <Typography variant="h6">
                    {current.question}
                  </Typography>
                </CardContent>
              </Card>

              {/* Back Side */}
              <Card
                sx={{
                  minHeight: 200,
                  mb: 2,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {current.answer}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Progress & Add New */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="caption">
              {currentIndex + 1} / {cards.length}
            </Typography>
            <Button size="small" onClick={() => setCurrentIndex(0)}>Reset</Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* New Card Form */}
          <Box component="form" onSubmit={(e) => { e.preventDefault(); addCard(); }}>
            <TextField
              label="New Question"
              fullWidth
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Answer"
              fullWidth
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box textAlign="right">
              <Button type="submit" variant="contained">
                Add Flashcard
              </Button>
            </Box>
          </Box>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}
