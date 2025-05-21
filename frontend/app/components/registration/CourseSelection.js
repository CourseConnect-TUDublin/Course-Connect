import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Box,
  Container,
  TextField,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseSelection = ({ onNext, onBack, discipline }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
        const response = await fetch(
          `${apiBase}/api/courses?disciplineId=${discipline._id}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch courses: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (discipline?._id) {
      fetchCourses();
    }
  }, [discipline]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleNext = () => {
    if (selectedCourse) {
      onNext({ 
        course: selectedCourse,
        disciplineId: discipline._id
      });
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Select Your Course
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Choose a course from {discipline.name}
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 3,
                      },
                      border: selectedCourse?.id === course.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {course.name}
                      </Typography>
                      {course.code && (
                        <Typography variant="body2" color="text.secondary">
                          {course.code}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredCourses.length === 0 && (
            <Box textAlign="center" mt={4}>
              <Typography color="text.secondary">
                No courses found matching your search
              </Typography>
            </Box>
          )}

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
              onClick={handleNext}
              disabled={!selectedCourse}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Container>
    </motion.div>
  );
};

export default CourseSelection; 