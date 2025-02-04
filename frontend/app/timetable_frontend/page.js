"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

// This page will interact with your API at /api/timetable
export default function TimetableFrontend() {
  // State for timetable entries
  const [timetable, setTimetable] = useState([]);
  // State for the new entry form
  const [newEntry, setNewEntry] = useState({
    course: "",
    lecturer: "",
    room: "",
    date: "",
    time: "",
  });

  // Fetch timetable entries from the API
  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/timetable");
      const data = await res.json();
      setTimetable(data.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Handle adding a new entry
  const handleAddEntry = async () => {
    // Check that all fields are filled in
    if (
      !newEntry.course ||
      !newEntry.lecturer ||
      !newEntry.room ||
      !newEntry.date ||
      !newEntry.time
    ) {
      alert("All fields are required!");
      return;
    }

    // (Assumes that the user enters the date as DD/MM/YYYY and time as HH:mm AM/PM)
    const updatedEntry = { ...newEntry };

    console.log("Adding New Entry:", updatedEntry);

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      });
      const responseData = await res.json();
      console.log("Response from API:", responseData);
      // Clear the form fields
      setNewEntry({
        course: "",
        lecturer: "",
        room: "",
        date: "",
        time: "",
      });
      // Refresh the timetable
      fetchTimetable();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        University Timetable
      </Typography>

      {/* Form to add a new entry */}
      <Typography variant="h6" gutterBottom>
        Add New Entry
      </Typography>
      <TextField
        label="Course Name"
        fullWidth
        margin="normal"
        value={newEntry.course}
        onChange={(e) =>
          setNewEntry({ ...newEntry, course: e.target.value })
        }
      />
      <TextField
        label="Lecturer"
        fullWidth
        margin="normal"
        value={newEntry.lecturer}
        onChange={(e) =>
          setNewEntry({ ...newEntry, lecturer: e.target.value })
        }
      />
      <TextField
        label="Room Number"
        fullWidth
        margin="normal"
        value={newEntry.room}
        onChange={(e) =>
          setNewEntry({ ...newEntry, room: e.target.value })
        }
      />
      <TextField
        label="Date (DD/MM/YYYY)"
        fullWidth
        margin="normal"
        value={newEntry.date}
        onChange={(e) =>
          setNewEntry({ ...newEntry, date: e.target.value })
        }
      />
      <TextField
        label="Time (HH:mm AM/PM)"
        fullWidth
        margin="normal"
        value={newEntry.time}
        onChange={(e) =>
          setNewEntry({ ...newEntry, time: e.target.value })
        }
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddEntry}
        sx={{ mt: 2 }}
      >
        Add Entry
      </Button>

      {/* Display the timetable in a table */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Timetable
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Lecturer</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetable.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.course}</TableCell>
                <TableCell>{entry.lecturer}</TableCell>
                <TableCell>{entry.room}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
