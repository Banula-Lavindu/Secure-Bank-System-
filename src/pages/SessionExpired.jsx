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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';

const SessionExpired = () => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <AccessTimeIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Session Expired
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Your session has timed out due to inactivity. Please log in again to continue.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
          >
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SessionExpired;