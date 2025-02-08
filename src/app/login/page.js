"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token (if needed)
      localStorage.setItem("authToken", data.token);

      // Redirect after login
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" gutterBottom>
            Login to your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
              label="Remember Me"
              sx={{ display: "flex", justifyContent: "start", mt: 1 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
