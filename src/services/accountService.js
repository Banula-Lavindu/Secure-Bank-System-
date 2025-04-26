import api from './api';

/**
 * Service for handling bank accounts operations
 */
const accountService = {
  /**
   * Get all user's bank accounts
   * @returns {Promise} - Response with accounts data or error
   */
  getAccounts: async () => {
    try {
      const response = await api.get('/accounts/bank-accounts/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch accounts' };
    }
  },

  /**
   * Get account details by ID
   * @param {string} accountId - Account ID
   * @returns {Promise} - Response with account details or error
   */
  getAccountDetails: async (accountId) => {
    try {
      const response = await api.get(`/accounts/bank-accounts/${accountId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch account details' };
    }
  },

  /**
   * Get active user sessions
   * @returns {Promise} - Response with sessions data or error
   */
  getUserSessions: async () => {
    try {
      const response = await api.get('/accounts/sessions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user sessions' };
    }
  },

  /**
   * Terminate a user session
   * @param {string} sessionId - Session ID to terminate
   * @returns {Promise} - Response with termination status or error
   */
  terminateSession: async (sessionId) => {
    try {
      const response = await api.post(`/accounts/sessions/${sessionId}/terminate/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to terminate session' };
    }
  },

  /**
   * Update user preferences (language, dark mode, etc.)
   * @param {Object} preferences - User preferences data
   * @returns {Promise} - Response with updated preferences or error
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/accounts/preferences/', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update preferences' };
    }
  },

  /**
   * Get user preferences
   * @returns {Promise} - Response with user preferences or error
   */
  getPreferences: async () => {
    try {
      const response = await api.get('/accounts/preferences/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch preferences' };
    }
  }
};

export default accountService;