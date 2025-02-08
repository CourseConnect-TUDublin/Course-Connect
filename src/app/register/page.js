"use client";
import { useState } from "react";
import { Container, TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
    alert("Registration successful (local only, no database).");
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
