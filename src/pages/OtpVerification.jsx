import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';

// Material UI imports
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Stack
} from '@mui/material';

// OTP Input Component
const OtpInput = ({ length = 6, value, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      setOtp([...otpArray, ...Array(length - otpArray.length).fill('')]);
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    if (newValue.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    
    // Notify parent component
    onChange(newOtp.join(''));
    
    // Auto focus next input field if filled
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace with empty input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pasteData)) return; // Only allow digits
    
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pasteData.length, length); i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus on the appropriate field after paste
    if (pasteData.length < length) {
      inputRefs.current[Math.min(pasteData.length, length - 1)].focus();
    }
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {Array(length).fill(0).map((_, index) => (
        <TextField
          key={index}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          inputRef={(el) => (inputRefs.current[index] = el)}
          variant="outlined"
          autoComplete="one-time-code"
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
          }}
          sx={{ width: { xs: '40px', sm: '56px' }, height: { xs: '50px', sm: '56px' } }}
        />
      ))}
    </Stack>
  );
};

// Timer Component for Resend Code
const ResendTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Typography variant="body2" color="text.secondary">
      Resend code in {formatTime(timeLeft)}
    </Typography>
  );
};

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showResend, setShowResend] = useState(true);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Retrieve email from localStorage for verification
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('tempEmail') || user?.email || '';
  });

  // Determine if this is a registration verification
  const [purpose, setPurpose] = useState(() => {
    return localStorage.getItem('otpPurpose') || 'registration';
  });
  
  useEffect(() => {
    // For development convenience, auto-populate the OTP if it exists in localStorage
    const tempOtpCode = localStorage.getItem('tempOtpCode');
    if (tempOtpCode) {
      setOtp(tempOtpCode);
      // Remove it after using to prevent security issues
      localStorage.removeItem('tempOtpCode');
    }

    // If no email is found, redirect to login
    if (!email) {
      navigate('/login');
    }
  }, [navigate, email]);
  
  const handleOtpChange = (value) => {
    setOtp(value);
    setError(''); // Clear error when user types
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!email) {
        throw new Error('Email address not found. Please try registering again.');
      }

      // Call API to verify OTP
      const response = await authService.verifyOTP(email, otp, purpose);
      
      // Update token if a new one is provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        
        // If this was a registration verification, perform login with the response
        if (purpose === 'registration' && response.user) {
          await login(response); // Use the login function from AuthContext to set user state
        }
      }
      
      // Clean up localStorage items
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('otpPurpose');
      
      // Redirect based on user role
      if (response.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      if (!email) {
        throw new Error('Email address not found. Please try registering again.');
      }
      
      // Call API to resend OTP
      await authService.resendOTP(email, purpose);
      
      setResendSuccess(true);
      setShowResend(false); // Hide the resend button
      
      // Show resend button after timer expires
      setTimeout(() => {
        setShowResend(true);
        setResendSuccess(false);
      }, 60000); // 60 seconds
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
        Verify OTP
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        A verification code has been sent to your email. Please enter it below.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Verification code has been resent to your email.
        </Alert>
      )}
      
      <Box sx={{ mb: 4 }}>
        <OtpInput length={6} value={otp} onChange={handleOtpChange} />
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || otp.length !== 6}
        onClick={handleVerify}
        sx={{ mb: 3, py: 1.5, borderRadius: '8px', fontWeight: 'bold' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
      </Button>
      
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {showResend ? (
          <Button
            variant="text"
            color="primary"
            disabled={resendLoading}
            onClick={handleResendOtp}
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        ) : (
          <ResendTimer seconds={60} onComplete={() => setShowResend(true)} />
        )}
      </Box>
      
      <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <strong>Demo Note:</strong> For testing purposes, use code <strong>123456</strong> to proceed to the dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default OtpVerification;