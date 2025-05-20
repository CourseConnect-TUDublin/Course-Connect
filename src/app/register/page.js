"use client";

// React and Next.js hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";
// MUI components for UI layout and inputs
import {
  Container, Card, CardContent, Typography, TextField, Button,
  MenuItem, Box, Alert, CircularProgress, RadioGroup,
  FormControlLabel, Radio, Checkbox, FormGroup
} from "@mui/material";

// Animation settings for form transitions
const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

// Steps for multi-step form
const steps = [
  { label: "Your Details" },
  { label: "Password" },
  { label: "Programme & Courses" }
];

export default function Register() {
  // Track current step in registration process
  const [step, setStep] = useState(0);
  // User form data: personal info, selected programme, selected courses, semester
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    programme: "", courses: [], semester: "1"
  });
  // All programmes fetched from API
  const [programmes, setProgrammes] = useState([]);
  // Courses related to selected programme
  const [courses, setCourses] = useState([]);
  // Status flags
  const [fetchingProgrammes, setFetchingProgrammes] = useState(false); // true while loading programmes
  const [loading, setLoading] = useState(false); // true while submitting
  const [error, setError] = useState(""); // display errors
  const [success, setSuccess] = useState(""); // display success
  const router = useRouter(); // for navigation

  // Fetch all available programmes on mount
  useEffect(() => {
    setFetchingProgrammes(true);
    fetch("/api/programmeData")
      .then(res => res.json())
      .then(data => setProgrammes(Array.isArray(data.data) ? data.data : []))
      .catch(() => setProgrammes([]))
      .finally(() => setFetchingProgrammes(false));
  }, []);

  // When selected programme changes, update available courses and clear course selections
  useEffect(() => {
    const prog = programmes.find(p => p.name === formData.programme);
    setCourses(prog && Array.isArray(prog.courses) ? prog.courses : []);
    setFormData(f => ({ ...f, courses: [] }));
  }, [formData.programme, programmes]);

  // Generic handler for input field changes
  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  // Handle adding/removing courses; enforce max 5
  const handleCourseToggle = course =>
    setFormData(f => {
      const selected = f.courses.includes(course)
        ? f.courses.filter(c => c !== course)
        : f.courses.length < 5 ? [...f.courses, course] : f.courses;
      return { ...f, courses: selected };
    });

  // Step validation: require relevant fields before moving on
  const validateStep = () => {
    if (step === 0) return formData.name && formData.email;
    if (step === 1) return formData.password;
    if (step === 2) return formData.programme && formData.courses.length && formData.semester;
    return true;
  };

  // Handle final registration submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500); // redirect to login after short delay
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Move to next step if fields are valid
  const nextStep = () => {
    if (!validateStep()) return setError("Please fill in all fields.");
    setError(""); setStep(s => s + 1);
  };

  // Move to previous step
  const prevStep = () => { setError(""); setStep(s => s - 1); };

  // === Step 1: User details ===
  const StepDetails = (
    <motion.form {...fade} key="details" onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
      <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>Next</Button>
    </motion.form>
  );

  // === Step 2: Password entry ===
  const StepPassword = (
    <motion.form {...fade} key="password" onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" type="submit">Next</Button>
      </Box>
    </motion.form>
  );

  // === Step 3: Programme, course selection, and semester ===
  const StepProgramme = (
    <motion.form {...fade} key="programme" onSubmit={handleSubmit}>
      {/* Programme dropdown */}
      <TextField
        select label="Programme" name="programme"
        value={formData.programme} onChange={handleChange}
        fullWidth margin="normal" required disabled={fetchingProgrammes}
      >
        {fetchingProgrammes
          ? <MenuItem value=""><CircularProgress size={18} sx={{ mr: 1 }} /> Loading…</MenuItem>
          : programmes.length === 0
            ? <MenuItem value="">No programmes found</MenuItem>
            : programmes.map(p => <MenuItem key={p._id} value={p.name}>{p.name}</MenuItem>)
        }
      </TextField>

      {/* Course multi-select */}
      <FormGroup
  sx={{
    my: 2,
    maxHeight: 200,       
    overflowY: "auto",
    border: "1px solid #eee",
    borderRadius: 2,
    p: 1,
    background: "#fafbfc",
  }}
>
  <Typography sx={{ mb: 1, fontWeight: 500, position: "sticky", top: 0, zIndex: 1, background: "#fafbfc" }}>
    Select up to 5 Courses
  </Typography>
  {courses.length === 0 && formData.programme &&
    <Typography color="text.secondary" sx={{ mb: 1 }}>No courses found</Typography>
  }
  {courses.map(course => (
    <FormControlLabel
      key={course}
      control={
        <Checkbox
          checked={formData.courses.includes(course)}
          onChange={() => handleCourseToggle(course)}
          disabled={
            !formData.courses.includes(course) && formData.courses.length >= 5
          }
        />
      }
      label={course}
    />
  ))}
</FormGroup>


      {/* Semester radio buttons */}
      <Typography sx={{ mb: 1, fontWeight: 500 }}>Semester</Typography>
      <RadioGroup row name="semester" value={formData.semester} onChange={handleChange}>
        <FormControlLabel value="1" control={<Radio />} label="Semester 1" />
        <FormControlLabel value="2" control={<Radio />} label="Semester 2" />
      </RadioGroup>

      {/* Form navigation and submit */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
        </Button>
      </Box>
    </motion.form>
  );

  // === Main form container and step display ===
 return (
  <Container maxWidth={false} disableGutters sx={{ minHeight: "100vh", p: 0 }}>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#fafbfc" }}
    >
      <Card
        sx={{
          width: "90vw",
          height: "90vh",
          borderRadius: 4,
          boxShadow: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CardContent sx={{ width: "100%", maxWidth: 540, mx: "auto" }}>
          <Typography variant="h4" textAlign="center" gutterBottom>Register</Typography>
          <Typography textAlign="center" mb={2} color="text.secondary">
            Step {step + 1} of {steps.length}: {steps[step].label}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
          <AnimatePresence mode="wait">
            {step === 0 && StepDetails}
            {step === 1 && StepPassword}
            {step === 2 && StepProgramme}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  </Container>
);


}
