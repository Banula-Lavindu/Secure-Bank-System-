import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import transactionService from '../services/transactionService';
import accountService from '../services/accountService';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NoteIcon from '@mui/icons-material/Note';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';

// Validation schema
const TransferSchema = Yup.object().shape({
  fromAccount: Yup.string()
    .required('Please select source account'),
  toAccount: Yup.string()
    .required('Please select beneficiary account')
    .notOneOf([Yup.ref('fromAccount')], 'Cannot transfer to the same account'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .test('is-greater-than-min', 'Amount must be at least LKR 100.00', value => value >= 100)
    .test(
      'is-within-balance',
      'Amount exceeds available balance',
      function(value) {
        const { fromAccount } = this.parent;
        const account = this.options.context?.accounts?.find(acc => acc.id.toString() === fromAccount);
        if (!account) return true; // Skip validation if account not found
        return parseFloat(value) <= parseFloat(account.balance);
      }
    ),
  reference: Yup.string()
    .max(50, 'Reference should not exceed 50 characters')
});

// Helper function to format currency
const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const FundTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Define fetchData outside useEffect to reuse it after successful transfer
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user accounts
      const accountsData = await accountService.getAccounts();
      // Filter out only checking and savings accounts that are active
      const eligibleAccounts = Array.isArray(accountsData) 
        ? accountsData.filter(acc => 
            (acc.account_type === 'checking' || acc.account_type === 'savings') && 
            acc.is_active && 
            parseFloat(acc.balance) > 0
          )
        : [];
      setAccounts(eligibleAccounts);

      // Fetch beneficiaries
      const beneficiariesResponse = await transactionService.getBeneficiaries();
      const beneficiariesData = beneficiariesResponse?.results || 
                               (Array.isArray(beneficiariesResponse) ? beneficiariesResponse : []);
      setBeneficiaries(beneficiariesData);

    } catch (err) {
      console.error('Error fetching fund transfer data:', err);
      setError('Failed to load accounts or beneficiaries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (values, { setSubmitting }) => {
    setTransferDetails(values);
    setConfirmDialogOpen(true);
    setSubmitting(false);
  };
  
  const handleConfirmTransfer = async () => {
    setTransferLoading(true);
    setTransferError('');
    
    try {
      // Get the selected beneficiary details
      const selectedBeneficiary = beneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount);
      
      // Call the API to transfer funds
      const response = await transactionService.createTransfer({
        fromAccountId: transferDetails.fromAccount,
        amount: parseFloat(transferDetails.amount),
        reference: transferDetails.reference || 'Fund Transfer',
        // For external transfers to beneficiaries
        destinationAccountExternal: selectedBeneficiary.account_number,
        destinationBankExternal: selectedBeneficiary.bank
      });
      
      // Set reference number from response
      setTransferReference(response.reference_number);
      
      setTransferSuccess(true);
      setConfirmDialogOpen(false);
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferError(error.message || 'Failed to process transfer. Please try again.');
    } finally {
      setTransferLoading(false);
    }
  };
  
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    
    // Reset form after successful transfer
    if (window.formikRef) {
      window.formikRef.resetForm();
    }
    
    // Reset states
    setTransferDetails(null);
    setTransferSuccess(false);
    setTransferReference('');
    
    // Refresh account data to show updated balances
    fetchData();
  };
  
  // Fix for handling beneficiary selection from the sidebar
  const handleSelectBeneficiary = (beneficiary) => {
    if (window.formikRef) {
      window.formikRef.setFieldValue('toAccount', beneficiary.id.toString());
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Fund Transfer
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Transfer Details
            </Typography>
            
            <Formik
              initialValues={{
                fromAccount: '',
                toAccount: '',
                amount: '',
                reference: ''
              }}
              validationSchema={TransferSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
              enableReinitialize={true}
              innerRef={(formik) => { window.formikRef = formik; }}
              validationContext={{ accounts }}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl 
                        fullWidth 
                        error={touched.fromAccount && Boolean(errors.fromAccount)}
                      >
                        <InputLabel id="from-account-label">From Account</InputLabel>
                        <Field
                          as={Select}
                          name="fromAccount"
                          labelId="from-account-label"
                          label="From Account"
                        >
                          {accounts.map((account) => (
                            <MenuItem key={account.id} value={account.id.toString()}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography>{account.account_type === 'checking' ? 'Checking' : 'Savings'} ({account.account_number})</Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  {formatCurrency(account.balance, account.currency)}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Field>
                        {touched.fromAccount && errors.fromAccount && (
                          <FormHelperText>{errors.fromAccount}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl 
                        fullWidth 
                        error={touched.toAccount && Boolean(errors.toAccount)}
                      >
                        <InputLabel id="to-account-label">To Account/Beneficiary</InputLabel>
                        <Field
                          as={Select}
                          name="toAccount"
                          labelId="to-account-label"
                          label="To Account/Beneficiary"
                        >
                          {beneficiaries.map((beneficiary) => (
                            <MenuItem key={beneficiary.id} value={beneficiary.id.toString()}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography>{beneficiary.name}</Typography>
                                  {beneficiary.is_favorite && (
                                    <StarIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {beneficiary.account_number} • {beneficiary.bank}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Field>
                        {touched.toAccount && errors.toAccount && (
                          <FormHelperText>{errors.toAccount}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="amount"
                        label="Amount"
                        placeholder="Enter amount"
                        type="number"
                        error={touched.amount && Boolean(errors.amount)}
                        helperText={touched.amount && errors.amount}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">LKR</InputAdornment>
                          ),
                        }}
                      />
                      {values.fromAccount && accounts.find(acc => acc.id.toString() === values.fromAccount) && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Available Balance: {formatCurrency(
                            accounts.find(acc => acc.id.toString() === values.fromAccount).balance,
                            accounts.find(acc => acc.id.toString() === values.fromAccount).currency
                          )}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="reference"
                        label="Reference/Note"
                        placeholder="What's this transfer for?"
                        multiline
                        rows={2}
                        error={touched.reference && Boolean(errors.reference)}
                        helperText={touched.reference && errors.reference}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SendIcon />}
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                      >
                        Continue to Review
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                Recent Beneficiaries
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {beneficiaries.length === 0 ? (
              <Alert severity="info">No recent beneficiaries found.</Alert>
            ) : (
              <List sx={{ width: '100%' }}>
                {beneficiaries.slice(0, 3).map((beneficiary) => (
                  <ListItem 
                    key={beneficiary.id}
                    alignItems="flex-start"
                    sx={{ 
                      mb: 1, 
                      p: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectBeneficiary(beneficiary)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {beneficiary.name}
                          {beneficiary.is_favorite && (
                            <StarIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span" color="text.secondary">
                            {beneficiary.account_number} • {beneficiary.bank}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 1 }}
              component={Link}
              to="/beneficiaries"
            >
              View All Beneficiaries
            </Button>
          </Paper>
          
          <Card sx={{ bgcolor: 'primary.light', color: 'white', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transfer Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Double-check beneficiary details before confirming
              </Typography>
              <Typography variant="body2" paragraph>
                • Add a reference for tracking your transfer
              </Typography>
              <Typography variant="body2">
                • For large transfers, consider multiple smaller transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Confirm Transfer</Typography>
          <IconButton onClick={handleCloseConfirmDialog} disabled={transferLoading} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {transferError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {transferError}
            </Alert>
          )}
          
          {transferDetails && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Please review the transfer details:
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <AccountBalanceIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">From Account</Typography>
                      <Typography variant="body1">
                        {accounts.find(acc => acc.id.toString() === transferDetails.fromAccount)?.name} 
                        ({accounts.find(acc => acc.id.toString() === transferDetails.fromAccount)?.account_number})
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">To Beneficiary</Typography>
                      <Typography variant="body1">
                        {beneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.name} 
                        ({beneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.account_number})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {beneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.bank}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <AttachMoneyIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(parseFloat(transferDetails.amount))}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {transferDetails.reference && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <NoteIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Reference/Note</Typography>
                        <Typography variant="body1">
                          {transferDetails.reference}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                By confirming this transfer, you agree to our terms and conditions. This action cannot be undone.
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} disabled={transferLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleConfirmTransfer}
            disabled={transferLoading}
            startIcon={transferLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {transferLoading ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Transfer Successful!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Your transfer of {transferDetails && formatCurrency(parseFloat(transferDetails.amount))} has been processed successfully.
          </Typography>
          
          <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 3, mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Reference Number
            </Typography>
            <Typography variant="h6">
              {transferReference}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            A confirmation has been sent to your email address.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCloseSuccessDialog}
          >
            Make Another Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FundTransfer;