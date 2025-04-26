import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

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
    .required('First name is required')
    .matches(
      /^[a-zA-Z\s\-']+$/, 
      'First name can only contain letters, spaces, hyphens and apostrophes'
    )
    .max(30, 'First name must be at most 30 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(
      /^[a-zA-Z\s\-']+$/, 
      'Last name can only contain letters, spaces, hyphens and apostrophes'
    )
    .max(30, 'Last name must be at most 30 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .max(255, 'Email must be at most 255 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^[0-9+\-\s()]+$/, 
      'Phone number can only contain numbers, spaces, and + - ( ) characters'
    )
    .test(
      'len', 
      'Phone number must be between 7 and 15 digits', 
      val => !val || (val.replace(/\D/g, '').length >= 7 && val.replace(/\D/g, '').length <= 15)
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)'
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [serverError, setServerError] = useState(false);
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

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Clear any previous errors
      setRegisterError('');
      setServerError(false);
      
      if (!captchaVerified) {
        setRegisterError('Please complete the CAPTCHA verification');
        setSubmitting(false);
        return;
      }
      
      // Sanitize input values
      const sanitizedValues = {
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        password: values.password,
        password2: values.confirmPassword
      };
      
      // Call the registration API
      const response = await authService.register(sanitizedValues);
      
      // Show success message
      setRegistrationSuccess(true);
      
      // Store email and OTP code (if available) for verification
      localStorage.setItem('tempEmail', sanitizedValues.email);
      localStorage.setItem('otpPurpose', 'registration');
      
      // Always store an OTP code, using a default if none provided
      if (response && response.otp_code) {
        localStorage.setItem('tempOtpCode', response.otp_code);
      }
      
      // Redirect to OTP verification after a short delay
      setTimeout(() => {
        navigate('/otp-verification');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if it's a server error
      if (error.serverError) {
        setServerError(true);
        setRegisterError('Server error occurred. Please try again later.');
        return;
      }
      
      // Handle field-specific errors
      if (error.errors) {
        // Handle structured errors from the backend
        Object.entries(error.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          
          switch(field) {
            case 'email':
              setFieldError('email', message);
              break;
            case 'first_name':
              setFieldError('firstName', message);
              break;
            case 'last_name':
              setFieldError('lastName', message);
              break;
            case 'phone':
              setFieldError('phone', message);
              break;
            case 'password':
              setFieldError('password', message);
              break;
            case 'password2':
              setFieldError('confirmPassword', message);
              break;
            default:
              // For any other field errors, set as general error
              setRegisterError(prev => prev ? `${prev}. ${message}` : message);
          }
        });
      } else {
        // Handle individual field errors for backward compatibility
        if (error.email) {
          setFieldError('email', Array.isArray(error.email) ? error.email[0] : error.email);
        }
        if (error.first_name) {
          setFieldError('firstName', Array.isArray(error.first_name) ? error.first_name[0] : error.first_name);
        }
        if (error.last_name) {
          setFieldError('lastName', Array.isArray(error.last_name) ? error.last_name[0] : error.last_name);
        }
        if (error.phone) {
          setFieldError('phone', Array.isArray(error.phone) ? error.phone[0] : error.phone);
        }
        if (error.password) {
          setFieldError('password', Array.isArray(error.password) ? error.password[0] : error.password);
        }
        if (error.password2) {
          setFieldError('confirmPassword', Array.isArray(error.password2) ? error.password2[0] : error.password2);
        }
      }
      
      // Set general error message if no specific field errors were set
      if (!error.email && !error.first_name && !error.last_name && !error.phone && 
          !error.password && !error.password2 && !error.errors) {
        setRegisterError(error.message || error.non_field_errors?.[0] || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Registration Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please check your email for verification instructions.
        </Typography>
        <Typography variant="body2">
          Redirecting you to the next step...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2 }} />
      </Box>
    );
  }

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
      
      {serverError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          There appears to be a temporary issue with our registration service. Your information is secure, but you may need to try again later or contact support if the problem persists.
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
            
            {/* Display more detailed password requirements */}
            {touched.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Password must:
                </Typography>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>
                    <Typography variant="caption" color={errors.password ? "error.main" : "text.secondary"}>
                      Be at least 8 characters long
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="caption" color={errors.password ? "error.main" : "text.secondary"}>
                      Contain at least one uppercase letter
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="caption" color={errors.password ? "error.main" : "text.secondary"}>
                      Contain at least one lowercase letter
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="caption" color={errors.password ? "error.main" : "text.secondary"}>
                      Contain at least one number
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="caption" color={errors.password ? "error.main" : "text.secondary"}>
                      Contain at least one special character (@$!%*?&#)
                    </Typography>
                  </li>
                </ul>
              </Box>
            )}
            
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