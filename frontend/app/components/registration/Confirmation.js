'use client';

import { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowBack, CheckCircle } from '@mui/icons-material';

const Confirmation = ({
  registrationData,
  modules,
  onBack,
  onComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Safely filter modules if they exist
  const mandatoryModules = modules?.filter(m => !m.isElective) || [];
  const electiveModules = modules?.filter(m => m.isElective) || [];

  // Get selected elective modules by matching IDs
  const selectedElectiveModules = electiveModules.filter(module => 
    registrationData.selectedModules.includes(module._id)
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onComplete();
    } catch (err) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!modules) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Confirm Your Registration
        </Typography>

        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
          Please review your selections before proceeding
        </Typography>

        <Box mt={4}>
          {/* Course Information */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Course Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Course:</strong> {registrationData.course?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Year:</strong> {registrationData.year}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Semester:</strong> {registrationData.semester}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Group:</strong> {registrationData.group}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Selected Modules */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Selected Modules
            </Typography>

            {/* Mandatory Modules */}
            {mandatoryModules.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Mandatory Modules
                </Typography>
                <Grid container spacing={2}>
                  {mandatoryModules.map((module) => (
                    <Grid item xs={12} key={module._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">
                            {module.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {module.code} • {module.credits} credits
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Elective Modules */}
            {selectedElectiveModules.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Elective Modules
                </Typography>
                <Grid container spacing={2}>
                  {selectedElectiveModules.map((module) => (
                    <Grid item xs={12} key={module._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">
                            {module.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {module.code} • {module.credits} credits
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<CheckCircle />}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Registration'}
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Confirmation; 