import { useState } from "react";
import { TextField, Button, Box, IconButton, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Password validation helpers
const validatePassword = password => ({
  minLength: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
});
export const passwordIsStrong = password => Object.values(validatePassword(password)).every(Boolean);

export default function StepPassword({ password, setFormData, prevStep, nextStep }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const pwValidation = validatePassword(password);

  return (
    <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <TextField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        fullWidth
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(v => !v)}
              edge="end"
              size="small"
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        error={focused && !passwordIsStrong(password)}
      />
      <Box sx={{ pl: 1, py: 1 }}>
        <Typography fontSize={13} color={pwValidation.minLength ? "green" : "error"}>• At least 8 characters</Typography>
        <Typography fontSize={13} color={pwValidation.upper ? "green" : "error"}>• One uppercase letter</Typography>
        <Typography fontSize={13} color={pwValidation.lower ? "green" : "error"}>• One lowercase letter</Typography>
        <Typography fontSize={13} color={pwValidation.number ? "green" : "error"}>• One number</Typography>
        <Typography fontSize={13} color={pwValidation.special ? "green" : "error"}>• One special character</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" type="submit" disabled={!passwordIsStrong(password)}>Next</Button>
      </Box>
    </form>
  );
}
StepPassword.passwordIsStrong = passwordIsStrong; // Allow parent to reuse
