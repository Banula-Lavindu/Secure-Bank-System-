import React, { createContext, useState, useEffect, useMemo } from 'react';
import notificationService from '../services/notificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);
  
  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Use mock data if API fails
        setNotifications(generateMockNotifications());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up polling for new notifications (every 60 seconds)
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Optimistically update UI even if API fails
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Optimistically update UI even if API fails
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };
  
  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // Optimistically update UI even if API fails
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    }
  };
  
  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      // Optimistically update UI even if API fails
      setNotifications([]);
    }
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      isLoading,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Helper function to generate mock data if API fails
const generateMockNotifications = () => {
  const types = ['transaction', 'security', 'promotion', 'info'];
  const transactionMessages = [
    'You received a deposit of $1,250.00 from John Smith',
    'Your payment of $45.00 to Netflix was successful',
    'You transferred $500.00 to Savings Account',
    'Your credit card payment of $350.00 was processed',
    'A withdrawal of $200.00 was made from your account'
  ];
  const securityMessages = [
    'Your password was changed successfully',
    'New login detected from New York, USA',
    'Your two-factor authentication was enabled',
    'Your account details were updated',
    'Suspicious login attempt was blocked'
  ];
  const promotionMessages = [
    'Limited time offer: 5% cashback on all purchases',
    'You are eligible for a credit limit increase',
    'New savings account with 3.5% interest rate',
    'Refer a friend and earn $50 bonus',
    'Special mortgage rates for existing customers'
  ];
  const infoMessages = [
    'Our mobile app will be under maintenance on Sunday',
    'New features added to online banking',
    'Updated terms and conditions',
    'Holiday schedule: Closed on Monday',
    'Your monthly statement is ready to view'
  ];
  
  const notifications = [];
  
  // Generate 20 random notifications
  for (let i = 1; i <= 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    let message = '';
    
    switch (type) {
      case 'transaction':
        message = transactionMessages[Math.floor(Math.random() * transactionMessages.length)];
        break;
      case 'security':
        message = securityMessages[Math.floor(Math.random() * securityMessages.length)];
        break;
      case 'promotion':
        message = promotionMessages[Math.floor(Math.random() * promotionMessages.length)];
        break;
      case 'info':
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
        break;
      default:
        message = 'Notification message';
    }
    
    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    notifications.push({
      id: i,
      type,
      message,
      date: date.toISOString(),
      read: Math.random() > 0.3, // 70% chance of being read
      important: Math.random() > 0.7 // 30% chance of being important
    });
  }
  
  // Sort by date (newest first)
  return notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
};