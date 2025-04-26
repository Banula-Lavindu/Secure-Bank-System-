import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .max(255, 'Email must be at most 255 characters'),
  password: Yup.string()
    .required('Password is required')
    .max(128, 'Password must be at most 128 characters')
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Clear any previous errors
      setLoginError('');
      
      // Limit login attempts to prevent brute force
      if (loginAttempts >= 5) {
        setLoginError('Too many failed login attempts. Please try again later.');
        setSubmitting(false);
        return;
      }
      
      // Sanitize input
      const email = values.email.trim().toLowerCase();
      const password = values.password;
      
      // Call login method from AuthContext
      const response = await login(email, password);
      
      // Reset login attempts on success
      setLoginAttempts(0);
      
      // Redirect based on 2FA requirement
      if (response && response.requires_otp) {
        // Store email and purpose for OTP verification
        localStorage.setItem('tempEmail', email);
        localStorage.setItem('otpPurpose', 'login');
        
        navigate('/otp-verification');
      } else {
        // If 2FA is not required, redirect to dashboard
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Increment login attempts for rate limiting
      setLoginAttempts(prev => prev + 1);
      
      // Handle structured errors
      if (error.errors) {
        // Handle structured errors from the backend
        Object.entries(error.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          
          switch(field) {
            case 'email':
              setFieldError('email', message);
              break;
            case 'password':
              setFieldError('password', message);
              break;
            default:
              // For any other field errors, set as general error
              setLoginError(prev => prev ? `${prev}. ${message}` : message);
          }
        });
      } else {
        // Handle individual field errors for backward compatibility
        if (error.email) {
          setFieldError('email', Array.isArray(error.email) ? error.email[0] : error.email);
        }
        if (error.password) {
          setFieldError('password', Array.isArray(error.password) ? error.password[0] : error.password);
        }
        
        // Set general error message if no specific field errors
        if (!error.email && !error.password && !error.errors) {
          setLoginError(error.message || error.non_field_errors?.[0] || 'Invalid email or password. Please try again.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
        Welcome Back
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Sign in to access your banking dashboard
      </Typography>
      
      {loginError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loginError}
        </Alert>
      )}
      
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box sx={{ mb: 3 }}>
              <Field
                as={TextField}
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxLength: 255,
                  autoComplete: "email"
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Field
                as={TextField}
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxLength: 128,
                  autoComplete: "current-password"
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Field as={Checkbox} name="rememberMe" color="primary" />}
                label="Remember me"
              />
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Forgot Password?
                </Typography>
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || loginAttempts >= 5}
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
                <Link to="/register" style={{ textDecoration: 'none', marginLeft: '5px' }}>
                  <Typography variant="body2" component="span" color="primary" fontWeight="bold">
                    Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;