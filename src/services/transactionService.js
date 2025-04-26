import api from './api';

/**
 * Service for handling transactions and fund transfers
 */
const transactionService = {
  /**
   * Get transaction history with optional filters
   * @param {Object} filters - Optional filters for transactions
   * @returns {Promise} - Response with transaction data or error
   */
  getTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add all filters to the query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get('/transactions/list/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch transactions' };
    }
  },

  /**
   * Get transaction details by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} - Response with transaction details or error
   */
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch transaction details' };
    }
  },

  /**
   * Get recent transactions (limited number)
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise} - Response with recent transactions or error
   */
  getRecentTransactions: async (limit = 5) => {
    try {
      // Use the list endpoint with a limit parameter instead of the non-existent recent endpoint
      const response = await api.get('/transactions/list/', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent transactions' };
    }
  },

  /**
   * Create a fund transfer
   * @param {Object} transferData - Transfer details
   * @returns {Promise} - Response with transfer result or error
   */
  createTransfer: async (transferData) => {
    try {
      // Map the frontend field names to the backend field names
      const transferPayload = {
        source_account_id: transferData.fromAccountId,
        amount: transferData.amount,
        description: transferData.reference || 'Fund Transfer',
        currency: 'LKR'
      };
      
      // Add destination account ID if available
      if (transferData.toAccountId) {
        transferPayload.destination_account_id = transferData.toAccountId;
      }
      
      // Add external account details if available
      if (transferData.destinationAccountExternal) {
        transferPayload.destination_account_external = transferData.destinationAccountExternal;
        transferPayload.destination_bank_external = transferData.destinationBankExternal || '';
      }
      
      const response = await api.post('/transactions/transfer/', transferPayload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Transfer failed' };
    }
  },

  /**
   * Get beneficiaries for fund transfers
   * @returns {Promise} - Response with beneficiaries list or error
   */
  getBeneficiaries: async () => {
    try {
      const response = await api.get('/transactions/beneficiaries/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch beneficiaries' };
    }
  },

  /**
   * Add a new beneficiary
   * @param {Object} beneficiaryData - Beneficiary details
   * @returns {Promise} - Response with added beneficiary data or error
   */
  addBeneficiary: async (beneficiaryData) => {
    try {
      const response = await api.post('/transactions/beneficiaries/', beneficiaryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add beneficiary' };
    }
  },
  
  /**
   * Update an existing beneficiary
   * @param {string|number} beneficiaryId - ID of the beneficiary to update
   * @param {Object} beneficiaryData - Updated beneficiary details
   * @returns {Promise} - Response with updated beneficiary data or error
   */
  updateBeneficiary: async (beneficiaryId, beneficiaryData) => {
    try {
      const response = await api.put(`/transactions/beneficiaries/${beneficiaryId}/`, beneficiaryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update beneficiary' };
    }
  },
  
  /**
   * Delete a beneficiary
   * @param {string|number} beneficiaryId - ID of the beneficiary to delete
   * @returns {Promise} - Response with success status or error
   */
  deleteBeneficiary: async (beneficiaryId) => {
    try {
      const response = await api.delete(`/transactions/beneficiaries/${beneficiaryId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete beneficiary' };
    }
  },

  /**
   * Export transactions to CSV or PDF
   * @param {Object} filters - Optional filters for transactions
   * @param {string} format - Export format ('csv' or 'pdf')
   * @returns {Promise} - Response with export URL or error
   */
  exportTransactions: async (filters = {}, format = 'csv') => {
    try {
      const params = new URLSearchParams({ ...filters, format });
      
      // Use blob response type for file downloads
      const response = await api.get('/transactions/export/', { 
        params,
        responseType: 'blob' 
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export transactions' };
    }
  }
};

export default transactionService;