"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { Event, Today, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function SummaryCards({ router }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [metrics, setMetrics] = useState({
    tasksToday: 0,
    tasksTodayList: [],
    focusStreak: 0,
    nextClass: "--",
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [tasksRes, streakRes, classRes] = await Promise.all([
          fetch("/api/tasks/today"),
          fetch("/api/streak"),
          fetch("/api/timetable/next"),
        ]);

        const [tasks, streak, nextClass] = await Promise.all([
          tasksRes.json(),
          streakRes.json(),
          classRes.json(),
        ]);

        setMetrics({
          tasksToday: tasks?.count ?? 0,
          tasksTodayList: tasks?.tasks ?? [],
          focusStreak: streak?.days ?? 0,
          nextClass: nextClass?.time ?? "--",
        });
      } catch (err) {
        console.error("Failed to load metrics:", err);
      }
    }

    fetchMetrics();
  }, []);

  const cards = [
    {
      icon: Event,
      title: "Tasks Due Today",
      value: (
        <div>
          <strong>{metrics.tasksToday}</strong>
          {metrics.tasksTodayList.length > 0 && (
            <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 0 }}>
              {metrics.tasksTodayList.slice(0, 2).map((task, idx) => (
                <li key={idx} style={{ fontSize: 13 }}>
                  {task.title}
                  {task.dueTime && (
                    <span style={{ color: "#888", marginLeft: 6 }}>
                      @{task.dueTime}
                    </span>
                  )}
                </li>
              ))}
              {metrics.tasksTodayList.length > 2 && (
                <li style={{ fontSize: 12, color: "#888" }}>
                  +{metrics.tasksTodayList.length - 2} more…
                </li>
              )}
            </ul>
          )}
        </div>
      ),
      route: "/TaskManager",
      color: "#e3f2fd",
    },
    {
      icon: CheckCircle,
      title: "Study Streak",
      value: `${metrics.focusStreak} days`,
      route: "/focus-history",
      color: "#c8e6c9",
    },
    {
      icon: Today,
      title: "Next Class",
      value: metrics.nextClass,
      route: "/timetable",
      color: "#fff9c4",
    },
    // "Study Hub" card removed!
  ];

  return (
    <Grid container spacing={2} mb={4}>
      {cards.map((card, i) => (
        <Grid item xs={12} sm={4} key={i}>
          <CardActionArea onClick={() => router.push(card.route)}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, type: "spring" }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px #1976d214",
                transition: { duration: 0.2 },
              }}
            >
              <Card sx={{ borderRadius: 3, bgcolor: card.color }}>
                <CardHeader avatar={<card.icon />} title={card.title} />
                <CardContent>
                  {/* If value is a string, h5; if JSX (tasks), render directly */}
                  {typeof card.value === "string" ? (
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {card.value}
                    </Typography>
                  ) : (
                    card.value
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}
