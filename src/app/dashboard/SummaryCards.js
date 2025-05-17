// src/app/dashboard/SummaryCards.js
import React from "react";
import { Grid, Card, CardActionArea, CardHeader, CardContent, Typography } from "@mui/material";
import { Event, Today, CheckCircle } from "@mui/icons-material";

const pastelColors = ["#ffe4ec", "#e6f0ff", "#e6ffe6", "#f5e6ff", "#fffbe6"];

const metrics = [
  { icon: Event, title: "Tasks Due", value: 3, route: "/TaskManager" },
  { icon: Today, title: "Classes This Week", value: 5, route: "/timetable" },
  { icon: CheckCircle, title: "Deadlines", value: 2, route: "/assignments" },
  { icon: CheckCircle, title: "Focus Streak", value: "4 days", route: "/focus" },
];

export default function SummaryCards({ router }) {
  return (
    <Grid container spacing={2} mb={4}>
      {metrics.map((card, i) => (
        <Grid item xs={6} sm={3} key={i}>
          <CardActionArea onClick={() => router.push(card.route)}>
            <Card sx={{
              background: pastelColors[i % pastelColors.length],
              borderRadius: 3,
              boxShadow: 3,
              ":hover": { boxShadow: 8, transform: "translateY(-3px)" },
            }}>
              <CardHeader avatar={<card.icon sx={{ color: "#1976d2" }} />} title={card.title} />
              <CardContent>
                <Typography variant="h5">{card.value}</Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}
