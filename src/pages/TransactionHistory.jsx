import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';

// Date picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Mock transaction data
const generateTransactions = (count) => {
  const types = ['debit', 'credit'];
  const categories = ['Shopping', 'Food', 'Entertainment', 'Transport', 'Bills', 'Income', 'Transfer'];
  const descriptions = [
    'Amazon.com', 'Grocery Store', 'Netflix Subscription', 'Uber Ride', 
    'Electricity Bill', 'Salary Deposit', 'Restaurant Payment', 'Gas Station',
    'Phone Bill', 'Transfer to Savings', 'ATM Withdrawal', 'Online Purchase',
    'Insurance Payment', 'Gym Membership', 'Coffee Shop'
  ];
  
  const transactions = [];
  
  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Generate a random date within the last 3 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Generate random time
    const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // Generate random amount between 1 and 5000
    const amount = parseFloat((Math.random() * 4999 + 1).toFixed(2));
    
    transactions.push({
      id: i,
      type,
      amount,
      description,
      category,
      date: formattedDate,
      time,
      account: type === 'credit' ? 'Checking Account' : 'Checking Account',
      reference: `REF-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      status: 'Completed'
    });
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const allTransactions = generateTransactions(50);

// Helper function to format currency
const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TransactionHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  
  // Filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState(allTransactions);
  
  // Apply filters
  useEffect(() => {
    let result = allTransactions;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.reference.toLowerCase().includes(term)
      );
    }
    
    // Date range filter
    if (dateFrom) {
      result = result.filter(transaction => 
        new Date(transaction.date) >= dateFrom
      );
    }
    
    if (dateTo) {
      // Add one day to include the end date
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      
      result = result.filter(transaction => 
        new Date(transaction.date) < endDate
      );
    }
    
    // Transaction type filter
    if (typeFilter !== 'all') {
      result = result.filter(transaction => 
        transaction.type === typeFilter
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(transaction => 
        transaction.category === categoryFilter
      );
    }
    
    // Amount range filter
    if (amountMin) {
      result = result.filter(transaction => 
        transaction.amount >= parseFloat(amountMin)
      );
    }
    
    if (amountMax) {
      result = result.filter(transaction => 
        transaction.amount <= parseFloat(amountMax)
      );
    }
    
    setFilteredTransactions(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, dateFrom, dateTo, typeFilter, categoryFilter, amountMin, amountMax]);
  
  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(allTransactions.map(t => t.category))];
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const toggleFilterPanel = () => {
    setFilterOpen(!filterOpen);
  };
  
  const clearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
    setTypeFilter('all');
    setCategoryFilter('all');
    setAmountMin('');
    setAmountMax('');
    setSearchTerm('');
  };
  
  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF file
    alert('Export functionality would be implemented here');
  };
  
  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Calculate if any filters are active
  const isFiltered = dateFrom || dateTo || typeFilter !== 'all' || categoryFilter !== 'all' || amountMin || amountMax;
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Transaction History
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filterOpen ? "contained" : "outlined"}
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={toggleFilterPanel}
            >
              Filters
              {isFiltered && (
                <Chip 
                  size="small" 
                  label={"Active"} 
                  color="secondary" 
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<GetAppIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        </Box>
        
        {filterOpen && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Filter Transactions
              </Typography>
              
              <Button 
                size="small" 
                color="primary" 
                onClick={clearFilters}
                disabled={!isFiltered}
              >
                Clear All
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={dateFrom}
                    onChange={setDateFrom}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    value={dateTo}
                    onChange={setDateTo}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Transaction Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="credit">Credit (Incoming)</MenuItem>
                    <MenuItem value="debit">Debit (Outgoing)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem 
                        key={category} 
                        value={category}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={amountMin}
                  onChange={(e) => setAmountMin(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={amountMax}
                  onChange={(e) => setAmountMax(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    hover
                    onClick={() => handleRowClick(transaction)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transaction.date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.account}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'action.selected',
                          color: 'text.primary'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {transaction.reference}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                        }}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={transaction.type === 'credit' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                        label={transaction.type === 'credit' ? 'Credit' : 'Debit'}
                        color={transaction.type === 'credit' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No transactions found matching your filters.
                    </Typography>
                    {isFiltered && (
                      <Button 
                        color="primary" 
                        onClick={clearFilters}
                        sx={{ mt: 1 }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Transaction Details</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Card sx={{ bgcolor: 'action.hover', mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Chip 
                      icon={selectedTransaction.type === 'credit' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                      label={selectedTransaction.type === 'credit' ? 'Credit' : 'Debit'}
                      color={selectedTransaction.type === 'credit' ? 'success' : 'error'}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" align="center">
                    {selectedTransaction.status}
                  </Typography>
                </CardContent>
              </Card>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReceiptLongIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{selectedTransaction.description}</Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTransaction.date)} at {selectedTransaction.time}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Account</Typography>
                    <Typography variant="body1">{selectedTransaction.account}</Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{selectedTransaction.category}</Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Reference Number</Typography>
                    <Typography variant="body1">{selectedTransaction.reference}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="outlined" startIcon={<GetAppIcon />}>
              Download Receipt
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TransactionHistory;