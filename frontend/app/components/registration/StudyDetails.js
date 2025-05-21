import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StudyDetails = ({ onNext, onBack, course }) => {
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    group: ''
  });

  const [errors, setErrors] = useState({});
  const [studyPaths, setStudyPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudyPaths = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
        const response = await fetch(
          `${apiBase}/api/study-paths?courseId=${course._id}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch study paths: ${response.statusText}`);
        }
        
        const data = await response.json();
        setStudyPaths(data);
      } catch (err) {
        console.error('Error fetching study paths:', err);
        setError(err.message || 'Failed to load study paths. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (course?._id) {
      fetchStudyPaths();
    }
  }, [course]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is filled
    if (value) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.year) newErrors.year = 'Academic year is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.group) newErrors.group = 'Module group is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext({
        ...formData,
        courseId: course._id
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        px={2}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Get unique years and semesters from study paths
  const years = [...new Set(studyPaths.map(path => path.year))].sort();
  const semesters = [...new Set(studyPaths.map(path => path.semester))].sort();
  
  // Get groups for selected year and semester
  const availableGroups = studyPaths
    .filter(path => path.year === formData.year && path.semester === formData.semester)
    .map(path => path.group);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          py={4}
        >
          {/* Course Summary */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Selected Course
            </Typography>
            <Typography variant="body1">
              {course.name}
            </Typography>
            {course.code && (
              <Typography variant="body2" color="text.secondary">
                Code: {course.code}
              </Typography>
            )}
          </Paper>

          <Typography variant="h4" component="h2" gutterBottom>
            Study Details
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Please provide your study information
          </Typography>

          <Stack spacing={3} sx={{ mt: 4, mb: 4 }}>
            {/* Academic Year Selection */}
            <FormControl 
              fullWidth 
              error={!!errors.year}
              required
            >
              <InputLabel id="year-label">Academic Year</InputLabel>
              <Select
                labelId="year-label"
                id="year"
                value={formData.year}
                label="Academic Year"
                onChange={handleChange('year')}
                aria-describedby="year-error"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    Year {year}
                  </MenuItem>
                ))}
              </Select>
              {errors.year && (
                <Typography 
                  color="error" 
                  variant="caption" 
                  id="year-error"
                >
                  {errors.year}
                </Typography>
              )}
            </FormControl>

            {/* Semester Selection */}
            <FormControl 
              fullWidth 
              error={!!errors.semester}
              required
            >
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                value={formData.semester}
                label="Semester"
                onChange={handleChange('semester')}
                aria-describedby="semester-error"
              >
                {semesters.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    Semester {semester}
                  </MenuItem>
                ))}
              </Select>
              {errors.semester && (
                <Typography 
                  color="error" 
                  variant="caption" 
                  id="semester-error"
                >
                  {errors.semester}
                </Typography>
              )}
            </FormControl>

            {/* Module Group Selection */}
            <FormControl 
              fullWidth 
              error={!!errors.group}
              required
              disabled={!formData.year || !formData.semester}
            >
              <InputLabel id="group-label">Module Group</InputLabel>
              <Select
                labelId="group-label"
                id="group"
                value={formData.group}
                label="Module Group"
                onChange={handleChange('group')}
                aria-describedby="group-error"
              >
                {availableGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
              {errors.group && (
                <Typography 
                  color="error" 
                  variant="caption" 
                  id="group-error"
                >
                  {errors.group}
                </Typography>
              )}
            </FormControl>
          </Stack>

          {/* Navigation Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{ mt: 'auto', pt: 4 }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.year || !formData.semester || !formData.group}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Container>
    </motion.div>
  );
};

export default StudyDetails; 