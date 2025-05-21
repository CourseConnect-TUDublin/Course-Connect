"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Card, CardContent, Typography, Alert, Box } from "@mui/material";
import StepDetails from "./StepDetails";
import StepPassword from "./StepPassword";
import StepProgramme from "./StepProgramme";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const steps = [
  { label: "Your Details" },
  { label: "Password" },
  { label: "Programme & Courses" }
];

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    programme: "", courses: [], semester: "1"
  });
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fetchingProgrammes, setFetchingProgrammes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    setFetchingProgrammes(true);
    fetch("/api/programmeData")
      .then(res => res.json())
      .then(data => setProgrammes(Array.isArray(data.data) ? data.data : []))
      .catch(() => setProgrammes([]))
      .finally(() => setFetchingProgrammes(false));
  }, []);

  useEffect(() => {
    const prog = programmes.find(p => p.name === formData.programme);
    setCourses(prog && Array.isArray(prog.courses) ? prog.courses : []);
    setFormData(f => ({ ...f, courses: [] }));
  }, [formData.programme, programmes]);

  // Step validation
  const pwValid = StepPassword.passwordIsStrong(formData.password);
  const validateStep = () => {
    if (step === 0) return formData.name && formData.email;
    if (step === 1) return pwValid;
    if (step === 2) return formData.programme && formData.courses.length && formData.semester;
    return true;
  };

  // Submit handler
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
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Step handlers
  const nextStep = () => {
    if (!validateStep()) return setError("Please fill in all fields (Password must meet requirements).");
    setError(""); setStep(s => s + 1);
  };
  const prevStep = () => { setError(""); setStep(s => s - 1); };

  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: "100vh", p: 0 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: "#fafbfc" }}>
        <Card sx={{ width: "90vw", height: "90vh", borderRadius: 4, boxShadow: 6, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CardContent sx={{ width: "100%", maxWidth: 540, mx: "auto" }}>
            <Typography variant="h4" textAlign="center" gutterBottom>Register</Typography>
            <Typography textAlign="center" mb={2} color="text.secondary">
              Step {step + 1} of {steps.length}: {steps[step].label}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div {...fade} key="details">
                  <StepDetails formData={formData} setFormData={setFormData} nextStep={nextStep} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div {...fade} key="password">
                  <StepPassword password={formData.password} setFormData={setFormData} prevStep={prevStep} nextStep={nextStep} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div {...fade} key="programme">
                  <StepProgramme
                    formData={formData} setFormData={setFormData}
                    programmes={programmes} courses={courses}
                    fetchingProgrammes={fetchingProgrammes}
                    handleCourseToggle={course => setFormData(f => {
                      const selected = f.courses.includes(course)
                        ? f.courses.filter(c => c !== course)
                        : f.courses.length < 5 ? [...f.courses, course] : f.courses;
                      return { ...f, courses: selected };
                    })}
                    loading={loading}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
