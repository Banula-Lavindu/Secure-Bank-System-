import React, { createContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import accountService from '../services/accountService';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });
  
  // Create a theme instance based on the current mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#1976d2',
          light: '#63a4ff',
          dark: '#004ba0',
        },
        secondary: {
          main: '#f50057',
          light: '#ff5983',
          dark: '#bb002f',
        },
        error: {
          main: '#f44336',
        },
        warning: {
          main: '#ff9800',
        },
        info: {
          main: '#2196f3',
        },
        success: {
          main: '#4caf50',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#ffffff' : '#212121',
          secondary: darkMode ? '#b0b0b0' : '#757575',
        },
      },
      typography: {
        fontFamily: "'Poppins', sans-serif",
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
      },
    }),
    [darkMode]
  );

  // Load user preferences from the backend when authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const fetchUserPreferences = async () => {
        try {
          const preferences = await accountService.getPreferences();
          
          if (preferences) {
            // Update theme based on user preferences
            if (preferences.darkMode !== undefined) {
              setDarkMode(preferences.darkMode);
            }
            
            // Update language based on user preferences
            if (preferences.language) {
              setLanguage(preferences.language);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user preferences:', error);
          // Continue with local preferences if API fails
        }
      };
      
      fetchUserPreferences();
    }
  }, []);
  
  // Persist theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // Sync with backend if authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      const syncThemePreference = async () => {
        try {
          await accountService.updatePreferences({
            darkMode: darkMode
          });
        } catch (error) {
          console.error('Failed to sync theme preference with backend:', error);
        }
      };
      
      // Use a debounce to prevent too many API calls when toggling rapidly
      const timeoutId = setTimeout(() => {
        syncThemePreference();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [darkMode]);
  
  // Persist language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Sync with backend if authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      const syncLanguagePreference = async () => {
        try {
          await accountService.updatePreferences({
            language: language
          });
        } catch (error) {
          console.error('Failed to sync language preference with backend:', error);
        }
      };
      
      syncLanguagePreference();
    }
  }, [language]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleTheme,
      language,
      changeLanguage
    }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};