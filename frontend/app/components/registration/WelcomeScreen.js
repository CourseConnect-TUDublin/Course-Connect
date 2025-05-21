import { motion } from 'framer-motion';
import { Typography, Button, Box, Container } from '@mui/material';

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffffff, #f7f7f7)'
      }}
    >
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
          py={4}
        >
          <Box mb={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Welcome to CourseConnect
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Your journey to academic success starts here
            </Typography>
          </Box>

          <Box mb={4}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 2
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Complete registration in just a few steps
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
};

export default WelcomeScreen; 