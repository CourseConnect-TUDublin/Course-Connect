// src/app/dashboard/SummaryCards.js
"use client";
import React from "react";
import { Grid, Card, CardHeader, CardContent, Typography, CardActionArea } from "@mui/material";
import { Event, Today, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function SummaryCards({ router }) {
  const metrics = {
    tasksDue: 3,
    classesThisWeek: 5,
    upcomingDeadlines: 2,
    focusStreak: 4,
  };

  const cards = [
    { icon: Event, title: "Tasks Due", value: metrics.tasksDue, route: "/TaskManager", color: "#e3f2fd" },
    { icon: Today, title: "Classes This Week", value: metrics.classesThisWeek, route: "/timetable", color: "#fff9c4" },
    { icon: CheckCircle, title: "Deadlines", value: metrics.upcomingDeadlines, route: "/assignments", color: "#ffe0b2" },
    { icon: CheckCircle, title: "Focus Streak", value: `${metrics.focusStreak} days`, route: "/focus", color: "#c8e6c9" },
  ];

  return (
    <Grid container spacing={2} mb={4}>
      {cards.map((card, i) => (
        <Grid item xs={6} sm={3} key={i}>
          <CardActionArea onClick={() => router.push(card.route)}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, type: "spring" }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px #1976d214",
                transition: { duration: 0.2 }
              }}
            >
              <Card sx={{ borderRadius: 3, bgcolor: card.color }}>
                <CardHeader avatar={<card.icon />} title={card.title} />
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{card.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}
