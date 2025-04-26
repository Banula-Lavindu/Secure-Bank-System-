import api from './api';

/**
 * Service for handling account statements and reports
 */
const statementService = {
  /**
   * Get all statements with optional year filter
   * @param {number} year - Optional year filter
   * @returns {Promise} - Response with statements data or error
   */
  getStatements: async (year) => {
    try {
      const params = year ? { year } : {};
      const response = await api.get('/accounts/statements/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statements' };
    }
  },

  /**
   * Get statement details by ID
   * @param {string} statementId - Statement ID
   * @returns {Promise} - Response with statement details or error
   */
  getStatementDetails: async (statementId) => {
    try {
      const response = await api.get(`/accounts/statements/${statementId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statement details' };
    }
  },

  /**
   * Download statement in PDF format
   * @param {string} statementId - Statement ID
   * @returns {Promise} - Response with PDF blob or error
   */
  downloadStatementPDF: async (statementId) => {
    try {
      const response = await api.get(`/accounts/statements/${statementId}/download/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download statement' };
    }
  },

  /**
   * Email statement to user's email address
   * @param {string} statementId - Statement ID
   * @returns {Promise} - Response with email status or error
   */
  emailStatement: async (statementId) => {
    try {
      const response = await api.post(`/accounts/statements/${statementId}/email/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to email statement' };
    }
  },

  /**
   * Get yearly financial summary for charts
   * @param {number} year - Year to get summary for
   * @returns {Promise} - Response with yearly summary data or error
   */
  getYearlySummary: async (year) => {
    try {
      const response = await api.get('/accounts/yearly-summary/', {
        params: { year }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch yearly summary' };
    }
  }
};

export default statementService;