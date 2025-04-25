import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
  Divider,
  CircularProgress
} from '@mui/material';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean()
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Clear any previous errors
      setLoginError('');
      
      // In a real app, you would make an API call here
      console.log('Login attempt with:', values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll simulate a successful login
      localStorage.setItem('authToken', 'demo-token-12345');
      localStorage.setItem('userData', JSON.stringify({
        id: '1',
        name: 'saman kumara',
        email: values.email,
        // Set role based on email for demo
        role: values.email === 'admin@example.com' ? 'admin' : 'customer'
      }));
      
      // Redirect to OTP verification
      navigate('/otp-verification');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password. Please try again.');
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
                label="Email or Phone Number"
                placeholder="Enter your email or phone number"
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Field
                    as={Checkbox}
                    name="rememberMe"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              sx={{ 
                py: 1.5,
                mb: 3,
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
                <Link to="/register" style={{ textDecoration: 'none', marginLeft: '5px' }}>
                  <Typography variant="body2" component="span" color="primary" fontWeight="bold">
                    Register Now
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