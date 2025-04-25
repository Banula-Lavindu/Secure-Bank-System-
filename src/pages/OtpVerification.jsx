import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    
    // Combine OTP digits and call parent onChange
    const combinedOtp = newOtp.join('');
    onChange(combinedOtp);
    
    // Auto-focus next input if current input is filled
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits
    
    const pastedOtp = pastedData.slice(0, length).split('');
    const newOtp = [...Array(length).fill('')];
    
    pastedOtp.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const focusIndex = Math.min(pastedOtp.length, length - 1);
    inputRefs.current[focusIndex].focus();
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 1, sm: 2 }
      }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputRef={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }
          }}
          variant="outlined"
          sx={{
            width: { xs: '40px', sm: '56px' },
            height: { xs: '50px', sm: '64px' }
          }}
        />
      ))}
    </Box>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
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
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();

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
      // In a real app, you would make an API call to verify the OTP
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // For demo purposes, we'll accept any 6-digit OTP
      // In a real app, you would validate the OTP against what was sent to the user
      if (otp.length === 6) {
        // Get user role from localStorage
        const userData = localStorage.getItem('userData');
        const role = userData ? JSON.parse(userData).role : 'customer';
        
        // Redirect based on user role
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      // In a real app, you would make an API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setResendSuccess(true);
      setShowResend(false); // Reset the timer
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleTimerComplete = () => {
    setShowResend(true);
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
        Verification Code
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        We've sent a 6-digit code to your email/phone. Enter the code below to verify your identity.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          A new verification code has been sent successfully.
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <OtpInput 
          length={6} 
          value={otp} 
          onChange={handleOtpChange} 
        />
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
        sx={{ 
          py: 1.5,
          mb: 3,
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        {showResend ? (
          <Button
            variant="text"
            color="primary"
            onClick={handleResendOtp}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        ) : (
          <CountdownTimer seconds={60} onComplete={handleTimerComplete} />
        )}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive the code? Check your spam folder or contact support.
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'action.hover', 
          p: 2, 
          mt: 4, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Demo Note:</strong> For testing purposes, use code <strong>123456</strong> to proceed to the dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default OtpVerification;