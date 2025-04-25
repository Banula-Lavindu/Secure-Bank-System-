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
import BlockIcon from '@mui/icons-material/Block';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Forbidden = () => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          403 - Access Forbidden
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page or resource.
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
            onClick={() => window.history.back()}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Forbidden;