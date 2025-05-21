import { TextField, Button } from "@mui/material";

export default function StepDetails({ formData, setFormData, nextStep }) {
  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
      <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>Next</Button>
    </form>
  );
}
