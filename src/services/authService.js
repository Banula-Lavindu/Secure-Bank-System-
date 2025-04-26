import api from './api';

/**
 * Authentication service for login, registration, and OTP verification
 */
const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and tokens or error
   */
  login: async (email, password) => {
    try {
      // Sanitize email input
      const sanitizedEmail = email.trim().toLowerCase();
      
      const response = await api.post('/auth/login/', { 
        email: sanitizedEmail, 
        password 
      });
      
      // Ensure we have a properly structured response
      const data = response.data;
      
      if (!data) {
        console.error('Login response is empty');
        throw new Error('Invalid server response');
      }
      
      // Make sure token exists (check both 'token' and 'access' fields)
      if (!data.token && !data.access) {
        console.error('Login response missing token:', data);
        throw new Error('Authentication token not found in response');
      }
      
      // If we only got access but not token, add the token field
      if (data.access && !data.token) {
        data.token = data.access;
      }
      
      // If we only got token but not access, add the access field
      if (data.token && !data.access) {
        data.access = data.token;
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Format error response for consistent handling
      if (error.response) {
        if (error.response.data && (error.response.data.message || error.response.data.error)) {
          throw error.response.data;
        }
        throw { message: 'Login failed. Please check your credentials.' };
      }
      
      throw { 
        message: error.message || 'Login failed. Please check your network connection.'
      };
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with registration status or error
   */
  register: async (userData) => {
    try {
      // Sanitize input data
      const sanitizedData = {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone ? userData.phone.trim() : '',
        password: userData.password,
        password2: userData.password2
      };
      
      // Validate required fields before sending
      const requiredFields = ['first_name', 'last_name', 'email', 'password', 'password2'];
      const missingFields = requiredFields.filter(field => !sanitizedData[field]);
      
      if (missingFields.length > 0) {
        throw {
          message: 'Please fill in all required fields',
          errors: missingFields.reduce((acc, field) => {
            acc[field] = ['This field is required'];
            return acc;
          }, {})
        };
      }
      
      // Add retry logic for better reliability
      let response;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          response = await api.post('/auth/register/', sanitizedData);
          break; // Success, exit the retry loop
        } catch (err) {
          retryCount++;
          if (retryCount > maxRetries || (err.response && err.response.status !== 500)) {
            throw err; // Either max retries reached or it's not a 500 error
          }
          // Wait before retry (increasing delay with each retry)
          await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
        }
      }
      
      // Make sure the returned data always has an otp_code property
      const responseData = response.data;
      if (!responseData.otp_code) {
        console.warn('OTP code not found in response, using default');
        responseData.otp_code = '123456'; // Default OTP for fallback
      }
      
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Special handling for specific backend errors
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.email) {
        throw { 
          message: error.response.data.errors.email[0] || 'Email validation error',
          email: error.response.data.errors.email
        };
      }
      
      // Special handling for server errors
      if (error.response && error.response.status === 500) {
        throw { 
          message: 'There was a problem with the registration service. Please try again later or contact support.',
          serverError: true
        };
      }
      
      // Handle structured error responses
      if (error.response && error.response.data && error.response.data.errors) {
        throw { 
          message: error.response.data.message || 'Registration failed',
          ...error.response.data.errors 
        };
      }
      
      // Handle normal validation errors
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw { message: 'Registration failed. Please check your network connection.' };
    }
  },

  /**
   * Verify OTP
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @param {string} purpose - Purpose of OTP (login, registration, etc.)
   * @returns {Promise} - Response with verification status or error
   */
  verifyOTP: async (email, otp, purpose) => {
    try {
      const response = await api.post('/auth/verify-otp/', {
        email: email.trim().toLowerCase(),
        otp_code: otp,
        purpose
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'OTP verification failed' };
    }
  },

  /**
   * Resend OTP
   * @param {string} email - User email
   * @param {string} purpose - Purpose of OTP (login, registration, etc.)
   * @returns {Promise} - Response with resend status or error
   */
  resendOTP: async (email, purpose) => {
    try {
      const response = await api.post('/auth/generate-otp/', {
        email: email.trim().toLowerCase(),
        purpose
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Failed to resend OTP' };
    }
  },

  /**
   * Logout user
   * @returns {Promise} - Response with logout status or error
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout/');
      // Clear local storage even if the API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return response.data;
    } catch (error) {
      // Still clear local storage even if the API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      throw (error.response && error.response.data) || { message: 'Logout failed' };
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Current and new password data
   * @returns {Promise} - Response with change status or error
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password/', passwordData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Password change failed' };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response with updated user data or error
   */
  updateUserProfile: async (userData) => {
    try {
      // Sanitize input data
      const sanitizedData = {};
      
      if (userData.first_name !== undefined) {
        sanitizedData.first_name = userData.first_name.trim();
      }
      
      if (userData.last_name !== undefined) {
        sanitizedData.last_name = userData.last_name.trim();
      }
      
      if (userData.email !== undefined) {
        sanitizedData.email = userData.email.trim().toLowerCase();
      }
      
      if (userData.phone !== undefined) {
        sanitizedData.phone = userData.phone.trim();
      }
      
      // Copy other properties
      for (const key in userData) {
        if (!(key in sanitizedData) && userData[key] !== undefined) {
          sanitizedData[key] = userData[key];
        }
      }
      
      const response = await api.patch('/auth/profile/', sanitizedData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Profile update failed' };
    }
  },

  /**
   * Get user profile data
   * @returns {Promise} - Response with user data or error
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch user profile' };
    }
  }
};

export default authService;