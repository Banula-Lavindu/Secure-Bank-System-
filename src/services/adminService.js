import api from './api';

/**
 * Service for handling admin panel operations
 */
const adminService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - Response with dashboard stats or error
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin-panel/stats/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin dashboard statistics' };
    }
  },

  /**
   * Get all users with optional filters
   * @param {Object} filters - Optional filters for users
   * @returns {Promise} - Response with users data or error
   */
  getUsers: async (filters = {}) => {
    try {
      const response = await api.get('/admin-panel/users/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  /**
   * Get user details by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Response with user details or error
   */
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin-panel/users/${userId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise} - Response with created user data or error
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin-panel/users/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} - Response with updated user data or error
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin-panel/users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  /**
   * Get security alerts
   * @param {Object} filters - Optional filters for alerts
   * @returns {Promise} - Response with security alerts or error
   */
  getSecurityAlerts: async (filters = {}) => {
    try {
      const response = await api.get('/admin-panel/security-alerts/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch security alerts' };
    }
  },

  /**
   * Get security audit logs
   * @param {Object} filters - Optional filters for logs
   * @returns {Promise} - Response with audit logs or error
   */
  getAuditLogs: async (filters = {}) => {
    try {
      const response = await api.get('/admin-panel/audit-logs/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch audit logs' };
    }
  },

  /**
   * Get system health status
   * @returns {Promise} - Response with system health data or error
   */
  getSystemHealth: async () => {
    try {
      const response = await api.get('/admin-panel/system-health/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system health' };
    }
  }
};

export default adminService;