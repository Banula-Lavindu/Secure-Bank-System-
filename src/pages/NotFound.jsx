import React from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';

// Icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          404 - Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for kumarasn't exist or has been moved.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;