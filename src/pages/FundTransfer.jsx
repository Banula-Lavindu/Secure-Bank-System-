import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HistoryIcon from '@mui/icons-material/History';

// Mock data for accounts
const accounts = [
  {
    id: 1,
    name: 'Checking Account',
    number: '**** 4567',
    balance: 5842.50,
    currency: 'LKR'
  },
  {
    id: 2,
    name: 'Savings Account',
    number: '**** 7890',
    balance: 12750.75,
    currency: 'LKR'
  }
];

// Mock data for recent beneficiaries
const recentBeneficiaries = [
  {
    id: 1,
    name: 'Jane Smith',
    accountNumber: '**** 1234',
    bank: 'Chase Bank',
    isFavorite: true,
    lastTransferDate: '2023-09-15'
  },
  {
    id: 2,
    name: 'Mike samanson',
    accountNumber: '**** 5678',
    bank: 'Bank of America',
    isFavorite: false,
    lastTransferDate: '2023-09-10'
  },
  {
    id: 3,
    name: 'Sarah Williams',
    accountNumber: '**** 9012',
    bank: 'Wells Fargo',
    isFavorite: true,
    lastTransferDate: '2023-09-05'
  },
  {
    id: 4,
    name: 'Robert Brown',
    accountNumber: '**** 3456',
    bank: 'Citibank',
    isFavorite: false,
    lastTransferDate: '2023-08-28'
  }
];

// Helper function to format currency
const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Validation schema
const TransferSchema = Yup.object().shape({
  fromAccount: Yup.string().required('Please select an account'),
  toAccount: Yup.string().required('Please select a recipient'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .test(
      'max-amount',
      'Insufficient funds',
      function(value) {
        const { fromAccount } = this.parent;
        const selectedAccount = accounts.find(acc => acc.id.toString() === fromAccount);
        return selectedAccount ? value <= selectedAccount.balance : true;
      }
    ),
  reference: Yup.string().max(50, 'Reference must be less than 50 characters')
});

const FundTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferReference, setTransferReference] = useState('');
  
  const handleSubmit = (values, { setSubmitting }) => {
    setTransferDetails(values);
    setConfirmDialogOpen(true);
    setSubmitting(false);
  };
  
  const handleConfirmTransfer = async () => {
    setTransferLoading(true);
    setTransferError('');
    
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Generate a reference number
      const referenceNumber = `TRF-${Date.now().toString().slice(-6)}`;
      setTransferReference(referenceNumber);
      
      setTransferSuccess(true);
      setConfirmDialogOpen(false);
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferError('Failed to process transfer. Please try again.');
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
    setTransferDetails(null);
    setTransferSuccess(false);
  };
  
  const handleSelectBeneficiary = (beneficiary, setFieldValue) => {
    setFieldValue('toAccount', beneficiary.id.toString());
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Fund Transfer
      </Typography>
      
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
                                <Typography>{account.name} ({account.number})</Typography>
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
                          <MenuItem value="" disabled>
                            <em>Select a beneficiary</em>
                          </MenuItem>
                          <MenuItem value="new">+ Add New Beneficiary</MenuItem>
                          <Divider />
                          {recentBeneficiaries.map((beneficiary) => (
                            <MenuItem key={beneficiary.id} value={beneficiary.id.toString()}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  <PersonIcon />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography>{beneficiary.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {beneficiary.accountNumber} • {beneficiary.bank}
                                  </Typography>
                                </Box>
                                {beneficiary.isFavorite && (
                                  <StarIcon color="warning" fontSize="small" />
                                )}
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
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        error={touched.amount && Boolean(errors.amount)}
                        helperText={touched.amount && errors.amount}
                      />
                      
                      {values.fromAccount && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Available Balance: {formatCurrency(
                            accounts.find(acc => acc.id.toString() === values.fromAccount)?.balance || 0
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
            
            <List sx={{ width: '100%' }}>
              {recentBeneficiaries.slice(0, 3).map((beneficiary) => (
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
                  onClick={() => handleSelectBeneficiary(beneficiary, (name, value) => {
                    const formikForm = document.querySelector('form');
                    if (formikForm) {
                      const formik = formikForm.Formik;
                      if (formik) {
                        formik.setFieldValue(name, value);
                      }
                    }
                  })}
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
                        {beneficiary.isFavorite && (
                          <StarIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span" color="text.secondary">
                          {beneficiary.accountNumber} • {beneficiary.bank}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 1 }}
            >
              View All Beneficiaries
            </Button>
          </Paper>
          
          <Card sx={{ bgcolor: 'primary.light', color: 'white', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Transfer Tips
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Double-check account details before confirming</li>
                <li>Transfers between our bank accounts are instant</li>
                <li>External transfers may take 1-3 business days</li>
                <li>Save beneficiaries for faster future transfers</li>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Confirm Transfer Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Confirm Transfer</Typography>
          <IconButton onClick={handleCloseConfirmDialog} size="small">
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
                        ({accounts.find(acc => acc.id.toString() === transferDetails.fromAccount)?.number})
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
                        {recentBeneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.name} 
                        ({recentBeneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.accountNumber})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {recentBeneficiaries.find(ben => ben.id.toString() === transferDetails.toAccount)?.bank}
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