import { TextField, Typography, Box, Button, CircularProgress } from "@mui/material";

export default function StepReason({ formData, setFormData, loading, prevStep, handleSubmit }) {
  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
//
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" mb={2}>
        Why do you want to use Course Connect?
      </Typography>
      <TextField
        label="Your answer"
        name="userReason"
        value={formData.userReason || ""}
        onChange={handleChange}
        fullWidth
        multiline
        minRows={4}
        required
        margin="normal"
      />
      <Box display="flex" gap={1} justifyContent="space-between" mt={2}>
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
        </Button>
      </Box>
    </form>
  );
}
