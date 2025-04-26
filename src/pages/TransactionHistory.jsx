import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import transactionService from '../services/transactionService';

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
  Stack,
  CircularProgress,
  Alert
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

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
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

// Convert API transaction data to component-friendly format
const mapTransaction = (transaction) => {
  return {
    id: transaction.id,
    date: new Date(transaction.date_created).toISOString().split('T')[0],
    time: new Date(transaction.date_created).toTimeString().substring(0, 8),
    description: transaction.description || 'No description',
    amount: parseFloat(transaction.amount),
    currency: transaction.currency || 'USD',
    type: transaction.transaction_type === 'deposit' || 
          transaction.source_account === null ? 'credit' : 'debit',
    category: transaction.category || 'Other',
    reference: transaction.reference_number,
    account: transaction.source_account_number || transaction.destination_account_number,
    status: transaction.status_display || transaction.status
  };
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  
  // Transactions states
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState(['all']);
  
  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all transactions
        const response = await transactionService.getTransactions();
        
        // Check if response is paginated (has results property)
        const transactions = response.results 
          ? response.results.map(mapTransaction) 
          : Array.isArray(response)
            ? response.map(mapTransaction)
            : []; // Fallback to empty array if no valid data
        
        setAllTransactions(transactions);
        setFilteredTransactions(transactions);
        
        // Extract unique categories for filter dropdown
        const uniqueCategories = ['all'];
        
        // Only try to extract categories if we have transactions
        if (transactions.length > 0) {
          transactions.forEach(t => {
            if (t.category && !uniqueCategories.includes(t.category)) {
              uniqueCategories.push(t.category);
            }
          });
        }
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (!allTransactions.length) return;
    
    let result = [...allTransactions];
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.reference?.toLowerCase().includes(term)
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
  }, [allTransactions, searchTerm, dateFrom, dateTo, typeFilter, categoryFilter, amountMin, amountMax]);
  
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
  
  const handleExport = async (format = 'csv') => {
    try {
      setLoading(true);
      
      // Create filter object from current filters
      const filters = {};
      if (dateFrom) filters.dateFrom = dateFrom.toISOString().split('T')[0];
      if (dateTo) filters.dateTo = dateTo.toISOString().split('T')[0];
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (amountMin) filters.minAmount = amountMin;
      if (amountMax) filters.maxAmount = amountMax;
      if (searchTerm) filters.search = searchTerm;
      
      // Call service to export
      const blob = await transactionService.exportTransactions(filters, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export transactions.');
    } finally {
      setLoading(false);
    }
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
  
  // Render loading state
  if (loading && !allTransactions.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Transaction History
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
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
              onClick={() => handleExport('csv')}
              disabled={loading}
            >
              Export CSV
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              )}
              
              {!loading && filteredTransactions
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
                        {transaction.account_name || transaction.account}
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
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
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
              
              {!loading && filteredTransactions.length === 0 && (
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
                    {selectedTransaction.type === 'credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
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
                    <Typography variant="body1">{selectedTransaction.account_name || selectedTransaction.account}</Typography>
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
            <Button 
              variant="outlined" 
              startIcon={<GetAppIcon />}
              onClick={async () => {
                try {
                  await transactionService.getTransactionDetails(selectedTransaction.id);
                  // Handle receipt download
                } catch (error) {
                  console.error("Error downloading receipt:", error);
                }
              }}
            >
              Download Receipt
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TransactionHistory;