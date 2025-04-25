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
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Validation schema
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

// CAPTCHA Component (simplified version)
const Captcha = ({ onChange }) => {
  const [verified, setVerified] = useState(false);
  
  const handleVerify = () => {
    // In a real app, this would verify with a real CAPTCHA service
    setVerified(true);
    if (onChange) onChange(true);
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, mb: 3 }}>
      <Typography variant="body2" gutterBottom>
        Please verify that you are not a robot
      </Typography>
      
      {verified ? (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography variant="body2">Verification successful</Typography>
        </Box>
      ) : (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleVerify}
          sx={{ mt: 1 }}
        >
          Verify
        </Button>
      )}
    </Paper>
  );
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCaptchaChange = (verified) => {
    setCaptchaVerified(verified);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Clear any previous errors
      setRegisterError('');
      
      if (!captchaVerified) {
        setRegisterError('Please complete the CAPTCHA verification');
        setSubmitting(false);
        return;
      }
      
      // In a real app, you would make an API call here
      console.log('Registration attempt with:', values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll simulate a successful registration
      localStorage.setItem('registrationSuccess', 'true');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
        Create Your Account
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Join our banking platform to access all our services
      </Typography>
      
      {registerError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {registerError}
        </Alert>
      )}
      
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email address"
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
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  variant="outlined"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
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
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Captcha onChange={handleCaptchaChange} />
            
            <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  name="termsAccepted"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the {' '}
                  <Link to="/terms" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" component="span" color="primary">
                      Terms and Conditions
                    </Typography>
                  </Link>
                  {' '} and {' '}
                  <Link to="/privacy" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" component="span" color="primary">
                      Privacy Policy
                    </Typography>
                  </Link>
                </Typography>
              }
            />
            {touched.termsAccepted && errors.termsAccepted && (
              <Typography variant="caption" color="error">
                {errors.termsAccepted}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              sx={{ 
                py: 1.5,
                mt: 3,
                mb: 3,
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
                <Link to="/login" style={{ textDecoration: 'none', marginLeft: '5px' }}>
                  <Typography variant="body2" component="span" color="primary" fontWeight="bold">
                    Login
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

export default Register;