import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import transactionService from '../services/transactionService';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Validation schema for adding beneficiaries
const BeneficiarySchema = Yup.object().shape({
  name: Yup.string()
    .required('Beneficiary name is required')
    .max(100, 'Name should not exceed 100 characters'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^[0-9]{8,20}$/, 'Account number must be 8-20 digits'),
  bank: Yup.string()
    .required('Bank name is required')
    .max(100, 'Bank name should not exceed 100 characters'),
  branch: Yup.string()
    .max(100, 'Branch name should not exceed 100 characters'),
  nickname: Yup.string()
    .max(50, 'Nickname should not exceed 50 characters'),
  isFavorite: Yup.boolean()
});

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentBeneficiary, setCurrentBeneficiary] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Banks in Sri Lanka - use for dropdown selection
  const sriLankanBanks = [
    'Bank of Ceylon',
    'People\'s Bank',
    'Commercial Bank',
    'Hatton National Bank',
    'Sampath Bank',
    'Seylan Bank',
    'Nations Trust Bank',
    'DFCC Bank',
    'Pan Asia Banking Corporation',
    'Union Bank of Colombo',
    'National Development Bank',
    'National Savings Bank',
    'Regional Development Bank',
    'State Mortgage & Investment Bank',
    'Cargills Bank',
    'Amana Bank',
    'Standard Chartered Bank',
    'HSBC Bank',
    'Citibank',
    'Other'
  ];

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  // Fetch beneficiaries from API
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getBeneficiaries();
      const data = response?.results || (Array.isArray(response) ? response : []);
      setBeneficiaries(data);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError('Failed to load beneficiaries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Open add beneficiary dialog
  const handleAddBeneficiary = () => {
    setActionError(null);
    setActionSuccess(null);
    setAddDialogOpen(true);
  };

  // Close add beneficiary dialog
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  // Handle add beneficiary submission
  const handleSubmitAdd = async (values, { resetForm }) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      await transactionService.addBeneficiary({
        name: values.name,
        account_number: values.accountNumber,
        bank: values.bank,
        branch: values.branch || '',
        nickname: values.nickname || '',
        is_favorite: values.isFavorite
      });
      
      setActionSuccess('Beneficiary added successfully!');
      resetForm();
      fetchBeneficiaries(); // Refresh beneficiary list
      
      // Close dialog after short delay to show success message
      setTimeout(() => {
        setAddDialogOpen(false);
        setActionSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      setActionError(error.message || 'Failed to add beneficiary. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit beneficiary dialog
  const handleEditBeneficiary = (beneficiary) => {
    setCurrentBeneficiary(beneficiary);
    setActionError(null);
    setActionSuccess(null);
    setEditDialogOpen(true);
  };

  // Close edit beneficiary dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentBeneficiary(null);
  };

  // Handle edit beneficiary submission
  const handleSubmitEdit = async (values, { resetForm }) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      await transactionService.updateBeneficiary(currentBeneficiary.id, {
        name: values.name,
        account_number: values.accountNumber,
        bank: values.bank,
        branch: values.branch || '',
        nickname: values.nickname || '',
        is_favorite: values.isFavorite
      });
      
      setActionSuccess('Beneficiary updated successfully!');
      resetForm();
      fetchBeneficiaries(); // Refresh beneficiary list
      
      // Close dialog after short delay to show success message
      setTimeout(() => {
        setEditDialogOpen(false);
        setCurrentBeneficiary(null);
        setActionSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      setActionError(error.message || 'Failed to update beneficiary. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (beneficiary) => {
    setCurrentBeneficiary(beneficiary);
    setConfirmDeleteOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
    setCurrentBeneficiary(null);
  };

  // Handle delete beneficiary confirmation
  const handleConfirmDelete = async () => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      await transactionService.deleteBeneficiary(currentBeneficiary.id);
      fetchBeneficiaries(); // Refresh beneficiary list
      setConfirmDeleteOpen(false);
      setCurrentBeneficiary(null);
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      setActionError(error.message || 'Failed to delete beneficiary. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (beneficiary) => {
    try {
      await transactionService.updateBeneficiary(beneficiary.id, {
        ...beneficiary,
        is_favorite: !beneficiary.is_favorite
      });
      fetchBeneficiaries(); // Refresh beneficiary list
    } catch (error) {
      console.error('Error updating favorite status:', error);
      // Show error notification if needed
    }
  };

  if (loading && beneficiaries.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Beneficiaries
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddBeneficiary}
        >
          Add Beneficiary
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Your Beneficiaries
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {beneficiaries.length === 0 ? (
              <Alert severity="info">
                No beneficiaries found. Add a beneficiary to make quick transfers.
              </Alert>
            ) : (
              <List>
                {beneficiaries.map((beneficiary) => (
                  <ListItem
                    key={beneficiary.id}
                    alignItems="flex-start"
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {beneficiary.name}
                          </Typography>
                          {beneficiary.nickname && (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({beneficiary.nickname})
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="text.primary">
                            {beneficiary.account_number}
                          </Typography>
                          <Typography variant="body2" component="div" color="text.secondary">
                            {beneficiary.bank}{beneficiary.branch ? ` - ${beneficiary.branch}` : ''}
                          </Typography>
                        </>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Tooltip title={beneficiary.is_favorite ? "Remove from favorites" : "Add to favorites"}>
                        <IconButton
                          edge="end"
                          onClick={() => handleToggleFavorite(beneficiary)}
                          color={beneficiary.is_favorite ? "warning" : "default"}
                        >
                          {beneficiary.is_favorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={() => handleEditBeneficiary(beneficiary)}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteClick(beneficiary)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoOutlinedIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">What are Beneficiaries?</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Beneficiaries are people or organizations that you regularly transfer money to.
                Adding them to your beneficiary list makes future transfers quicker and easier.
              </Typography>
              <Typography variant="body2">
                By adding someone as a beneficiary, you won't need to enter their account details
                each time you want to make a transfer.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Managing Beneficiaries
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="body2">
                  Mark important contacts as favorites
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EditIcon sx={{ mr: 1, color: 'info.main' }} fontSize="small" />
                <Typography variant="body2">
                  Edit details if information changes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DeleteIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
                <Typography variant="body2">
                  Remove beneficiaries you no longer need
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Beneficiary Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add New Beneficiary</Typography>
          <IconButton onClick={handleCloseAddDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Formik
          initialValues={{
            name: '',
            accountNumber: '',
            bank: '',
            branch: '',
            nickname: '',
            isFavorite: false
          }}
          validationSchema={BeneficiarySchema}
          onSubmit={handleSubmitAdd}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent dividers>
                {actionSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {actionSuccess}
                  </Alert>
                )}
                
                {actionError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {actionError}
                  </Alert>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Beneficiary Name *"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="accountNumber"
                      label="Account Number *"
                      fullWidth
                      error={touched.accountNumber && Boolean(errors.accountNumber)}
                      helperText={touched.accountNumber && errors.accountNumber}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth
                      error={touched.bank && Boolean(errors.bank)}
                    >
                      <InputLabel id="bank-label">Bank *</InputLabel>
                      <Field
                        as={Select}
                        name="bank"
                        labelId="bank-label"
                        label="Bank *"
                      >
                        {sriLankanBanks.map((bank) => (
                          <MenuItem key={bank} value={bank}>
                            {bank}
                          </MenuItem>
                        ))}
                      </Field>
                      {touched.bank && errors.bank && (
                        <FormHelperText>{errors.bank}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="branch"
                      label="Branch (Optional)"
                      fullWidth
                      error={touched.branch && Boolean(errors.branch)}
                      helperText={touched.branch && errors.branch}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="nickname"
                      label="Nickname (Optional)"
                      placeholder="Give a friendly name to this beneficiary"
                      fullWidth
                      error={touched.nickname && Boolean(errors.nickname)}
                      helperText={touched.nickname && errors.nickname}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Field
                          as={Switch}
                          name="isFavorite"
                          color="warning"
                        />
                      }
                      label="Add to favorites"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCloseAddDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Adding...' : 'Add Beneficiary'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Beneficiary Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Beneficiary</Typography>
          <IconButton onClick={handleCloseEditDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        {currentBeneficiary && (
          <Formik
            initialValues={{
              name: currentBeneficiary.name,
              accountNumber: currentBeneficiary.account_number,
              bank: currentBeneficiary.bank,
              branch: currentBeneficiary.branch || '',
              nickname: currentBeneficiary.nickname || '',
              isFavorite: currentBeneficiary.is_favorite
            }}
            validationSchema={BeneficiarySchema}
            onSubmit={handleSubmitEdit}
          >
            {({ errors, touched }) => (
              <Form>
                <DialogContent dividers>
                  {actionSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {actionSuccess}
                    </Alert>
                  )}
                  
                  {actionError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {actionError}
                    </Alert>
                  )}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="name"
                        label="Beneficiary Name *"
                        fullWidth
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="accountNumber"
                        label="Account Number *"
                        fullWidth
                        error={touched.accountNumber && Boolean(errors.accountNumber)}
                        helperText={touched.accountNumber && errors.accountNumber}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl 
                        fullWidth
                        error={touched.bank && Boolean(errors.bank)}
                      >
                        <InputLabel id="edit-bank-label">Bank *</InputLabel>
                        <Field
                          as={Select}
                          name="bank"
                          labelId="edit-bank-label"
                          label="Bank *"
                        >
                          {sriLankanBanks.map((bank) => (
                            <MenuItem key={bank} value={bank}>
                              {bank}
                            </MenuItem>
                          ))}
                        </Field>
                        {touched.bank && errors.bank && (
                          <FormHelperText>{errors.bank}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="branch"
                        label="Branch (Optional)"
                        fullWidth
                        error={touched.branch && Boolean(errors.branch)}
                        helperText={touched.branch && errors.branch}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="nickname"
                        label="Nickname (Optional)"
                        placeholder="Give a friendly name to this beneficiary"
                        fullWidth
                        error={touched.nickname && Boolean(errors.nickname)}
                        helperText={touched.nickname && errors.nickname}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Field
                            as={Switch}
                            name="isFavorite"
                            color="warning"
                          />
                        }
                        label="Add to favorites"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={handleCloseEditDialog}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Beneficiary</DialogTitle>
        <DialogContent>
          {actionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {actionError}
            </Alert>
          )}
          
          <Typography variant="body1">
            Are you sure you want to delete this beneficiary?
          </Typography>
          {currentBeneficiary && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {currentBeneficiary.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentBeneficiary.account_number} • {currentBeneficiary.bank}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Beneficiaries;