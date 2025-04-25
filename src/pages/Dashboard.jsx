import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import SendIcon from '@mui/icons-material/Send';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Mock data for the dashboard
const accountData = {
  checking: {
    name: 'Checking Account',
    number: '**** 4567',
    balance: 5842.50,
    currency: 'LKR'
  },
  savings: {
    name: 'Savings Account',
    number: '**** 7890',
    balance: 12750.75,
    currency: 'LKR'
  },
  credit: {
    name: 'Credit Card',
    number: '**** 1234',
    balance: 1250.00,
    limit: 5000.00,
    dueDate: '2023-10-15',
    currency: 'LKR'
  },
  loan: {
    name: 'Personal Loan',
    number: 'LN-12345',
    balance: 15000.00,
    totalAmount: 25000.00,
    nextPayment: 750.00,
    nextPaymentDate: '2023-10-20',
    currency: 'LKR'
  }
};

const recentTransactions = [
  {
    id: 1,
    type: 'debit',
    amount: 120.50,
    description: 'Amazon.com',
    category: 'Shopping',
    date: '2023-09-28',
    time: '14:30'
  },
  {
    id: 2,
    type: 'credit',
    amount: 2500.00,
    description: 'Salary Deposit',
    category: 'Income',
    date: '2023-09-25',
    time: '09:15'
  },
  {
    id: 3,
    type: 'debit',
    amount: 45.00,
    description: 'Netflix Subscription',
    category: 'Entertainment',
    date: '2023-09-22',
    time: '18:45'
  },
  {
    id: 4,
    type: 'debit',
    amount: 85.75,
    description: 'Grocery Store',
    category: 'Food',
    date: '2023-09-20',
    time: '11:20'
  }
];

const notifications = [
  {
    id: 1,
    type: 'warning',
    message: 'Your credit card payment is due in 3 days',
    date: '2023-09-28'
  },
  {
    id: 2,
    type: 'info',
    message: 'New security features have been added to your account',
    date: '2023-09-25'
  }
];

// Helper function to format currency
const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Account Balance Card Component
const AccountCard = ({ account }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        },
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: '-20px',
          left: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {account.name.includes('Checking') && <AccountBalanceIcon />}
        {account.name.includes('Savings') && <SavingsIcon />}
        {account.name.includes('Credit') && <CreditCardIcon />}
        {account.name.includes('Loan') && <AccountBalanceIcon />}
      </Box>
      
      <CardContent sx={{ pt: 4 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {account.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Account Number: {account.number}
        </Typography>
        
        <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
          {formatCurrency(account.balance, account.currency)}
        </Typography>
        
        {account.name.includes('Credit') && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Credit Limit: {formatCurrency(account.limit, account.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((account.balance / account.limit) * 100)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(account.balance / account.limit) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Due Date: {new Date(account.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}
        
        {account.name.includes('Loan') && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total: {formatCurrency(account.totalAmount, account.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(((account.totalAmount - account.balance) / account.totalAmount) * 100)}% Paid
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={((account.totalAmount - account.balance) / account.totalAmount) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Next Payment: {formatCurrency(account.nextPayment, account.currency)} on {new Date(account.nextPaymentDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={Link} 
          to={account.name.includes('Credit') ? '/statements' : '/transactions'}
          endIcon={<ArrowForwardIcon />}
        >
          {account.name.includes('Credit') ? 'View Statement' : 'View Transactions'}
        </Button>
      </CardActions>
    </Card>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  return (
    <ListItem 
      alignItems="flex-start"
      secondaryAction={
        <IconButton edge="end" aria-label="more">
          <MoreVertIcon />
        </IconButton>
      }
      sx={{ 
        borderLeft: '4px solid',
        borderColor: transaction.type === 'credit' ? 'success.main' : 'error.main',
        mb: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <ListItemIcon>
        <Avatar 
          sx={{ 
            bgcolor: transaction.type === 'credit' ? 'success.light' : 'error.light',
            color: '#fff'
          }}
        >
          {transaction.type === 'credit' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </Avatar>
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">
              {transaction.description}
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: transaction.type === 'credit' ? 'success.main' : 'error.main'
              }}
            >
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {transaction.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(transaction.date).toLocaleDateString()} {transaction.time}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

// Notification Item Component
const NotificationItem = ({ notification }) => {
  return (
    <ListItem 
      alignItems="flex-start"
      sx={{ 
        borderLeft: '4px solid',
        borderColor: notification.type === 'warning' ? 'warning.main' : 'info.main',
        mb: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <ListItemIcon>
        <Avatar 
          sx={{ 
            bgcolor: notification.type === 'warning' ? 'warning.light' : 'info.light',
            color: '#fff'
          }}
        >
          {notification.type === 'warning' ? <WarningIcon /> : <InfoIcon />}
        </Avatar>
      </ListItemIcon>
      
      <ListItemText
        primary={notification.message}
        secondary={new Date(notification.date).toLocaleDateString()}
      />
    </ListItem>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, saman
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's a summary of your accounts and recent activity
        </Typography>
      </Box>
      
      {/* Account Balances */}
      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Your Accounts
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <AccountCard account={accountData.checking} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <AccountCard account={accountData.savings} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <AccountCard account={accountData.credit} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <AccountCard account={accountData.loan} />
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Transactions
              </Typography>
              <Button 
                component={Link} 
                to="/transactions" 
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                View All
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ width: '100%' }}>
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SendIcon />}
                component={Link}
                to="/transfer"
              >
                New Transfer
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ReceiptLongIcon />}
                sx={{ ml: 2 }}
                component={Link}
                to="/statements"
              >
                View Statements
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Notifications
              </Typography>
              <Chip 
                icon={<NotificationsIcon />} 
                label={notifications.length} 
                color="primary" 
                size="small" 
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ width: '100%' }}>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                component={Link}
                to="/notifications"
              >
                View All Notifications
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;