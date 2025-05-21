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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const DepartmentSelection = ({ onNext }) => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
        const response = await fetch(`${apiBase}/api/disciplines`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch disciplines: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDisciplines(data);
      } catch (err) {
        console.error('Error fetching disciplines:', err);
        setError(err.message || 'Failed to load departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplines();
  }, []);

  const handleDisciplineSelect = (discipline) => {
    onNext({ discipline });
  };

  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              Select Your Department
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Choose the discipline that best matches your field of study
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search departments..."
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

          <Grid container spacing={2}>
            {filteredDisciplines.map((discipline) => (
              <Grid item xs={12} sm={6} md={4} key={discipline.id}>
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
                    }}
                    onClick={() => handleDisciplineSelect(discipline)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: discipline.color || '#ccc',
                          }}
                        />
                        <Typography variant="h6" component="div">
                          {discipline.name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredDisciplines.length === 0 && (
            <Box textAlign="center" mt={4}>
              <Typography color="text.secondary">
                No departments found matching your search
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </motion.div>
  );
};

export default DepartmentSelection; 