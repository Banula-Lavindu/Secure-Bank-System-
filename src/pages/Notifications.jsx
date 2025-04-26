import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { NotificationContext } from '../contexts/NotificationContext';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Button,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SecurityIcon from '@mui/icons-material/Security';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Mock data for notifications
const generateNotifications = () => {
  const types = ['transaction', 'security', 'promotion', 'info'];
  const transactionMessages = [
    'You received a deposit of $1,250.00 from saman Smith',
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

const allNotifications = generateNotifications();

// Helper function to format date
const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  
  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise, return the full date
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + 
         ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Notification Item Component
const NotificationItem = ({ notification, onRead, onDelete, onView }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'transaction':
        return <MonetizationOnIcon />;
      case 'security':
        return <SecurityIcon />;
      case 'promotion':
        return <CampaignIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <NotificationsIcon />;
    }
  };
  
  const getColor = () => {
    switch (notification.type) {
      case 'transaction':
        return 'primary';
      case 'security':
        return 'error';
      case 'promotion':
        return 'secondary';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };
  
  return (
    <ListItem 
      alignItems="flex-start"
      sx={{ 
        mb: 1, 
        p: 2,
        borderRadius: 1,
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        border: 1,
        borderColor: notification.read ? 'divider' : getColor() + '.main',
        '&:hover': { bgcolor: 'action.hover' }
      }}
      secondaryAction={
        <Box>
          {notification.important && (
            <Chip 
              label="Important" 
              color="error" 
              size="small" 
              sx={{ mr: 1 }}
            />
          )}
          <IconButton edge="end" aria-label="more" onClick={() => onView(notification)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemAvatar>
        <Badge 
          variant="dot" 
          color={getColor()} 
          invisible={notification.read}
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Avatar sx={{ bgcolor: `${getColor()}.light` }}>
            {getIcon()}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: notification.read ? 'regular' : 'bold',
              pr: 8 // Make room for the action buttons
            }}
          >
            {notification.message}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary" component="span">
            {formatDate(notification.date)}
          </Typography>
        }
        onClick={() => onView(notification)}
        sx={{ cursor: 'pointer' }}
      />
    </ListItem>
  );
};

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const { 
    notifications, 
    isLoading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications 
  } = useContext(NotificationContext);
  
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMarkAsRead = (notification) => {
    markAsRead(notification.id);
  };
  
  const handleDelete = (notification) => {
    deleteNotification(notification.id);
    
    if (detailDialogOpen && selectedNotification?.id === notification.id) {
      setDetailDialogOpen(false);
    }
  };
  
  const handleViewDetails = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification);
    }
    setSelectedNotification(notification);
    setDetailDialogOpen(true);
  };
  
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };
  
  // Filter notifications based on the selected tab
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.read);
      case 2: // Transaction
        return notifications.filter(n => n.type === 'transaction');
      case 3: // Security
        return notifications.filter(n => n.type === 'security');
      case 4: // Promotions
        return notifications.filter(n => n.type === 'promotion');
      default:
        return notifications;
    }
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Notifications
          {unreadCount > 0 && (
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        
        <Box>
          <Button 
            startIcon={<MarkEmailReadIcon />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{ mr: 1 }}
          >
            Mark All Read
          </Button>
          <Button 
            startIcon={<DeleteIcon />}
            color="error"
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                All
                <Chip 
                  label={notifications.length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Unread
                {unreadCount > 0 && (
                  <Chip 
                    label={unreadCount} 
                    color="error" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
          />
          <Tab label="Transactions" />
          <Tab label="Security" />
          <Tab label="Promotions" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <NotificationsList 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
            onView={handleViewDetails}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <NotificationsList 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
            onView={handleViewDetails}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <NotificationsList 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
            onView={handleViewDetails}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <NotificationsList 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
            onView={handleViewDetails}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <NotificationsList 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
            onView={handleViewDetails}
          />
        </TabPanel>
      </Paper>
      
      {/* Notification Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarColor(selectedNotification.type),
                    mr: 2
                  }}
                >
                  {getNotificationIcon(selectedNotification.type)}
                </Avatar>
                <Typography variant="h6">
                  {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)} Notification
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDetailDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
              <Typography variant="body1" paragraph>
                {selectedNotification.message}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Received: {formatDate(selectedNotification.date)}
              </Typography>
              
              {selectedNotification.important && (
                <Chip 
                  label="Important" 
                  color="error" 
                  size="small" 
                  sx={{ mt: 2 }}
                />
              )}
            </DialogContent>
            
            <DialogActions>
              <Button 
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => {
                  handleDelete(selectedNotification);
                  handleCloseDetailDialog();
                }}
              >
                Delete
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCloseDetailDialog}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

// Notifications List Component
const NotificationsList = ({ notifications, onRead, onDelete, onView }) => {
  if (notifications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No notifications to display
        </Typography>
        <Typography variant="body2" color="text.secondary">
          When you receive notifications, they will appear here
        </Typography>
      </Box>
    );
  }
  
  return (
    <List sx={{ width: '100%' }}>
      {notifications.map((notification) => (
        <React.Fragment key={notification.id}>
          <NotificationItem 
            notification={notification} 
            onRead={onRead} 
            onDelete={onDelete} 
            onView={onView}
          />
        </React.Fragment>
      ))}
    </List>
  );
};

// Helper functions for the dialog
const getNotificationIcon = (type) => {
  switch (type) {
    case 'transaction':
      return <MonetizationOnIcon />;
    case 'security':
      return <SecurityIcon />;
    case 'promotion':
      return <CampaignIcon />;
    case 'info':
      return <InfoIcon />;
    default:
      return <NotificationsIcon />;
  }
};

const getAvatarColor = (type) => {
  switch (type) {
    case 'transaction':
      return 'primary.light';
    case 'security':
      return 'error.light';
    case 'promotion':
      return 'secondary.light';
    case 'info':
      return 'info.light';
    default:
      return 'grey.light';
  }
};

export default Notifications;