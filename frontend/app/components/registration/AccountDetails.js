import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Stack
} from '@mui/material';

const AccountDetails = ({ onNext }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Student ID validation (B00XXXXXX format)
    if (!formData.studentId.match(/^B00\d{6}$/)) {
      newErrors.studentId = 'Student ID must be in format B00XXXXXX';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Construct email from student ID
        const email = `${formData.studentId}@mytudublin.ie`;
        
        await onNext({
          ...formData,
          email // Add the constructed email
        });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minHeight="100vh"
          py={4}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Enter your student ID and create a password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="studentId"
                name="studentId"
                label="Student ID"
                placeholder="B00XXXXXX"
                value={formData.studentId}
                onChange={handleChange}
                error={!!errors.studentId}
                helperText={errors.studentId}
                required
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />

              <Box mt={2}>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Next Step'}
                  </Button>
                </motion.div>
              </Box>
            </Stack>
          </form>
        </Box>
      </Container>
    </motion.div>
  );
};

export default AccountDetails; 