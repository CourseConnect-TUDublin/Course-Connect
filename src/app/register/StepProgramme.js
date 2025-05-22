import { Typography, Box, Button, CircularProgress, Paper } from "@mui/material";

const options = [
  "Organise my study sessions",
  "Collaborate with classmates",
  "Build better study habits "
];

export default function StepReason({ formData, setFormData, loading, prevStep, handleSubmit }) {
  // When a box is clicked, set the reason
  const handleSelect = (reason) => setFormData(f => ({ ...f, userReason: reason }));

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" mb={2}>
        Why do you want to use Course Connect?
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} my={2}>
        {options.map(option => (
          <Paper
            key={option}
            elevation={formData.userReason === option ? 6 : 1}
            onClick={() => handleSelect(option)}
            sx={{
              p: 2,
              cursor: "pointer",
              border: formData.userReason === option ? "2px solid #1976d2" : "1px solid #ccc",
              background: formData.userReason === option ? "#e3f2fd" : "#fff",
              fontWeight: formData.userReason === option ? 600 : 400,
              transition: "all 0.15s"
            }}
          >
            {option}
          </Paper>
        ))}
      </Box>
      <Box display="flex" gap={1} justifyContent="space-between" mt={2}>
        <Button onClick={prevStep}>Back</Button>
        <Button
          variant="contained"
          type="submit"
          disabled={loading || !formData.userReason}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
        </Button>
      </Box>
    </form>
  );
}
