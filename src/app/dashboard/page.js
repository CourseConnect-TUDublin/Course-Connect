"use client";

import Link from "next/link";
import { Box, Grid, Card, CardContent, Button, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mt: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Task Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Task Management</Typography>
              <Typography variant="body1">
                Manage your daily tasks efficiently.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                component={Link}
                href="/taskmanager"
              >
                Go to Task Manager
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Learning Insights Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Learning Insights</Typography>
              <Typography variant="body1">
                Track your learning progress.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                component={Link}
                href="/learninginsights"
              >
                View Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Timetable Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Timetable</Typography>
              <Typography variant="body1">
                View your course schedule.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                component={Link}
                href="/timetable"
              >
                Go to Timetable
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
