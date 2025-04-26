import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import notificationService from '../services/notificationService';

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
  useMediaQuery,
  CircularProgress,
  Alert
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Convert API transaction data to component-friendly format
const mapTransaction = (transaction) => {
  return {
    id: transaction.id,
    date: new Date(transaction.date_created).toISOString().split('T')[0],
    time: new Date(transaction.date_created).toTimeString().substring(0, 8),
    description: transaction.description || 'No description',
    amount: parseFloat(transaction.amount),
    currency: transaction.currency || 'LKR',
    type: transaction.transaction_type === 'deposit' || 
          transaction.source_account === null ? 'credit' : 'debit',
    category: transaction.category || transaction.transaction_category || 'Other',
    reference: transaction.reference_number,
    account: transaction.source_account_number || transaction.destination_account_number
  };
};

// Account Card Component
const AccountCard = ({ account }) => {
  if (!account) return null;
  
  // Determine account name if not explicitly provided
  const accountName = account.name || (
    account.account_type === 'checking' ? 'Checking Account' :
    account.account_type === 'savings' ? 'Savings Account' :
    account.account_type === 'credit' ? 'Credit Card' :
    account.account_type === 'loan' ? 'Loan Account' : 'Account'
  );
  
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 6
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
          boxShadow: 2
        }}
      >
        {account.account_type === 'checking' && <AccountBalanceIcon />}
        {account.account_type === 'savings' && <SavingsIcon />}
        {account.account_type === 'credit' && <CreditCardIcon />}
        {account.account_type === 'loan' && <AccountBalanceIcon />}
      </Box>
      
      <CardContent sx={{ pt: 4 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {accountName}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Account Number: {account.account_number}
        </Typography>
        
        <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
          {formatCurrency(account.balance, account.currency)}
        </Typography>
        
        {account.account_type === 'credit' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Credit Limit: {formatCurrency(account.credit_limit, account.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((account.balance / account.credit_limit) * 100)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(account.balance / account.credit_limit) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Due Date: {account.due_date ? new Date(account.due_date).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        )}
        
        {account.account_type === 'loan' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total: {formatCurrency(account.loan_amount, account.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(((account.loan_amount - account.balance) / account.loan_amount) * 100)}% Paid
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={((account.loan_amount - account.balance) / account.loan_amount) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Next Payment: {account.next_payment_amount ? formatCurrency(account.next_payment_amount, account.currency) : 'N/A'} on {account.next_payment_date ? new Date(account.next_payment_date).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={Link} 
          to={account.account_type === 'credit' ? '/statements' : '/transactions'}
          endIcon={<ArrowForwardIcon />}
        >
          {account.account_type === 'credit' ? 'View Statement' : 'View Transactions'}
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
        <IconButton edge="end" aria-label="more" size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      }
      sx={{ 
        borderLeft: '4px solid',
        borderColor: transaction.type === 'credit' ? 'success.main' : 'error.main',
        mb: 1,
        py: 1, // Reduce vertical padding for more compact display
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
      dense // Make the list item more compact
    >
      <ListItemIcon sx={{ minWidth: '40px' }}>
        <Avatar 
          sx={{ 
            bgcolor: transaction.type === 'credit' ? 'success.light' : 'error.light',
            color: '#fff',
            width: 32, // Smaller avatar
            height: 32 // Smaller avatar
          }}
        >
          {transaction.type === 'credit' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
        </Avatar>
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: '180px' }}>
              {transaction.description}
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: transaction.type === 'credit' ? 'success.main' : 'error.main'
              }}
            >
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {transaction.category}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(transaction.date).toLocaleDateString()}
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
        borderColor: notification.importance === 'high' ? 'warning.main' : 'info.main',
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
            bgcolor: notification.importance === 'high' ? 'warning.light' : 'info.light',
            color: '#fff'
          }}
        >
          {notification.importance === 'high' ? <WarningIcon /> : <InfoIcon />}
        </Avatar>
      </ListItemIcon>
      
      <ListItemText
        primary={notification.title}
        secondary={new Date(notification.date).toLocaleDateString()}
      />
    </ListItem>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useContext(AuthContext);
  
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch accounts
        const accountsData = await accountService.getAccounts();
        setAccounts(Array.isArray(accountsData) ? accountsData : []);

        // Fetch recent transactions
        const transactionsResponse = await transactionService.getRecentTransactions(5);
        
        // Process the transactions based on API response format
        let processedTransactions = [];
        
        if (transactionsResponse) {
          if (transactionsResponse.results) {
            // Handle paginated response
            processedTransactions = transactionsResponse.results;
          } else if (Array.isArray(transactionsResponse)) {
            // Handle direct array response
            processedTransactions = transactionsResponse;
          }
        }
        
        setTransactions(processedTransactions);

        // Fetch notifications
        const userNotifications = await notificationService.getNotifications({
          limit: 5,
          unreadOnly: true
        });
        setNotifications(Array.isArray(userNotifications) ? userNotifications : []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's a summary of your accounts and recent activity
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Your Accounts
      </Typography>
      
      {accounts.length === 0 ? (
        <Alert severity="info">No accounts found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((account) => (
            <Grid item xs={12} md={6} lg={3} key={account.id}>
              <AccountCard account={account} />
            </Grid>
          ))}
        </Grid>
      )}
      
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
            
            {transactions.length === 0 ? (
              <Alert severity="info">No recent transactions found.</Alert>
            ) : (
              <Box sx={{ maxHeight: '300px', overflow: 'auto', borderRadius: 1, mb: 2 }}>
                <List sx={{ width: '100%' }} dense>
                  {transactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={mapTransaction(transaction)} />
                  ))}
                </List>
              </Box>
            )}
            
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
            
            {notifications.length === 0 ? (
              <Alert severity="info">No notifications found.</Alert>
            ) : (
              <List sx={{ width: '100%' }}>
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </List>
            )}
            
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