'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  FormHelperText
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const MAX_ELECTIVES = 2;

const ModuleSelection = ({
  registrationData,
  onNext,
  onBack
}) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElectives, setSelectedElectives] = useState([]);
  const [validationError, setValidationError] = useState('');

  const { courseId, year, semester, group } = registrationData;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!courseId || !year || !semester || !group) {
          const missingParams = [];
          if (!courseId) missingParams.push('courseId');
          if (!year) missingParams.push('year');
          if (!semester) missingParams.push('semester');
          if (!group) missingParams.push('group');
          
          throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
        }

        const queryParams = new URLSearchParams({
          courseId,
          year,
          semester,
          group
        });

        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
        const url = `${backendUrl}/api/modules?${queryParams}`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch modules: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array of modules');
        }

        setModules(data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err.message || 'Failed to load modules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && year && semester && group) {
      fetchModules();
    } else {
      setError('Missing required course information');
      setLoading(false);
    }
  }, [courseId, year, semester, group]);

  const handleElectiveToggle = (moduleId) => {
    const id = String(moduleId);
    setSelectedElectives(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Corrected variable names
        return prev.filter(existingId => existingId !== id);
      } else if (prev.length < MAX_ELECTIVES) {
        return [...prev, id];
      }
      return prev;
    });
    setValidationError('');
  };
  

  const validateSelection = () => {
    // If there are no elective modules, skip validation
    if (electiveModules.length === 0) {
      return true;
    }

    if (selectedElectives.length === 0) {
      setValidationError('Please select at least one elective module');
      return false;
    }
    if (selectedElectives.length > MAX_ELECTIVES) {
      setValidationError(`You can only select up to ${MAX_ELECTIVES} elective modules`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateSelection()) {
      return;
    }

    const mandatoryModules = modules
      .filter(m => !m.isElective)
      .map(m => m._id);
    
    // If there are no elective modules, only include mandatory modules
    const allSelectedModules = electiveModules.length === 0 
      ? mandatoryModules 
      : [...mandatoryModules, ...selectedElectives];
    
    // Pass both selected module IDs and full module list to parent
    onNext(allSelectedModules, modules);
  };

  const mandatoryModules = modules.filter(m => !m.isElective);
  const electiveModules = modules.filter(m => m.isElective);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (modules.length === 0) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          No modules found for the selected course and study path.
        </Alert>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Go Back
          </Button>
        </Box>
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
          Select Your Modules
        </Typography>

        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
          Choose up to {MAX_ELECTIVES} elective modules
        </Typography>

        <Box mt={4}>
          {/* Mandatory Modules */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
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
          </Paper>

          {/* Elective Modules */}
          {electiveModules.length > 0 && (
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                Elective Modules
              </Typography>
              <Typography 
                variant="body2" 
                color={selectedElectives.length > MAX_ELECTIVES ? 'error' : 'textSecondary'}
                gutterBottom
              >
                {selectedElectives.length} of {MAX_ELECTIVES} electives selected
              </Typography>
              <Grid container spacing={2}>
                {electiveModules.map((module) => (
                  <Grid item xs={12} key={module._id}>
                    <Card 
                      variant="outlined"
                      sx={{
                        bgcolor: selectedElectives.includes(String(module._id))
 
                          ? 'action.selected' 
                          : 'background.paper',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: selectedElectives.includes(String(module._id))

                            ? 'action.selected'
                            : 'action.hover'
                        }
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedElectives.includes(String(module._id))}
                              onChange={() => handleElectiveToggle(module._id)}
                              disabled={!selectedElectives.includes(String(module._id)) && selectedElectives.length >= MAX_ELECTIVES}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle1">
                                {module.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {module.code} • {module.credits} credits
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {validationError && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {validationError}
                </FormHelperText>
              )}
            </Paper>
          )}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              // Enable Next button if there are no electives, otherwise check selection count
              disabled={electiveModules.length > 0 && (selectedElectives.length === 0 || selectedElectives.length > MAX_ELECTIVES)}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default ModuleSelection; 