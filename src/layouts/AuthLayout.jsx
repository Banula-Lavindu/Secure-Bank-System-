import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

// Material UI imports
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const AuthLayout = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? 'background.default' : '#f5f5f5',
        position: 'relative'
      }}
    >
      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          component={Link} 
          to="/"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Modern Bank
        </Typography>
      </Box>

      {/* Main Content */}
      <Container 
        component="main" 
        maxWidth="sm" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={darkMode ? 2 : 4}
          sx={{
            p: isMobile ? 3 : 4,
            borderRadius: 2,
            bgcolor: darkMode ? 'background.paper' : 'white',
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
              : '0 8px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Outlet />
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Modern Banking System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;