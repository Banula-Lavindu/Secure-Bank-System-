import api from './api';

/**
 * Service for handling user notifications
 */
const notificationService = {
  /**
   * Get all notifications with optional filters
   * @param {Object} filters - Optional filters (read status, type)
   * @returns {Promise} - Response with notifications data or error
   */
  getNotifications: async (filters = {}) => {
    try {
      const response = await api.get('/notifications/list/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  /**
   * Get notification details by ID
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Response with notification details or error
   */
  getNotificationDetails: async (notificationId) => {
    try {
      const response = await api.get(`/notifications/${notificationId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notification details' };
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Response with operation status or error
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} - Response with operation status or error
   */
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all notifications as read' };
    }
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Response with operation status or error
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  },

  /**
   * Delete all notifications
   * @returns {Promise} - Response with operation status or error
   */
  deleteAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications/delete-all/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete all notifications' };
    }
  },

  /**
   * Get unread notification count
   * @returns {Promise} - Response with count or error
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/count/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread count' };
    }
  },
  
  /**
   * Update notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise} - Response with updated preferences or error
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/notifications/preferences/', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update notification preferences' };
    }
  }
};

export default notificationService;