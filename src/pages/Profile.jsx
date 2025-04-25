import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ThemeContext } from '../contexts/ThemeContext';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DevicesIcon from '@mui/icons-material/Devices';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Personal Information Form Schema
const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required')
});

// Password Change Form Schema
const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
});

// Mock user data
const userData = {
  firstName: 'saman',
  lastName: 'kumara',
  email: 'saman.kumara@example.com',
  phone: '+1 (555) 123-4567',
  avatar: null,
  twoFactorEnabled: true,
  language: 'en',
  notificationsEnabled: true,
  sessions: [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: '2023-09-28T14:30:00',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, USA',
      lastActive: '2023-09-27T09:15:00',
      current: false
    }
  ]
};

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [tabValue, setTabValue] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleToggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  
  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setProfileUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setProfileUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setPasswordChangeSuccess(true);
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLogout = () => {
    // In a real app, you would clear auth state and redirect to login
    setLogoutDialogOpen(false);
    window.location.href = '/login';
  };
  
  const handleDeleteAccount = () => {
    // In a real app, you would make an API call to delete the account
    setDeleteAccountDialogOpen(false);
    window.location.href = '/login';
  };
  
  const handleOpenAvatarDialog = () => {
    setAvatarDialogOpen(true);
  };
  
  const handleCloseAvatarDialog = () => {
    setAvatarDialogOpen(false);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile & Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              {userData.avatar ? (
                <Avatar 
                  src={userData.avatar} 
                  alt={`${userData.firstName} ${userData.lastName}`}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '3rem'
                  }}
                >
                  {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                </Avatar>
              )}
              
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: -10,
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}
                onClick={handleOpenAvatarDialog}
              >
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="h5" gutterBottom>
              {userData.firstName} {userData.lastName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {userData.email}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {userData.phone}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Chip 
                icon={<SecurityIcon />} 
                label="2FA Enabled" 
                color="success" 
                variant="outlined" 
                size="small"
              />
            </Box>
            
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<LogoutIcon />}
              sx={{ mt: 3 }}
              onClick={() => setLogoutDialogOpen(true)}
            >
              Logout
            </Button>
          </Paper>
        </Grid>
        
        {/* Settings Tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Personal Information" />
              <Tab label="Security" />
              <Tab label="Preferences" />
              <Tab label="Sessions" />
            </Tabs>
            
            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              {profileUpdateSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Profile updated successfully!
                </Alert>
              )}
              
              <Formik
                initialValues={{
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  phone: userData.phone
                }}
                validationSchema={PersonalInfoSchema}
                onSubmit={handleUpdateProfile}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="firstName"
                          label="First Name"
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="lastName"
                          label="Last Name"
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="email"
                          label="Email Address"
                          type="email"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="phone"
                          label="Phone Number"
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <EditIcon />}
                        >
                          {isSubmitting ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              
              {passwordChangeSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password changed successfully!
                </Alert>
              )}
              
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }}
                validationSchema={PasswordChangeSchema}
                onSubmit={handleChangePassword}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="currentPassword"
                          label="Current Password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          error={touched.currentPassword && Boolean(errors.currentPassword)}
                          helperText={touched.currentPassword && errors.currentPassword}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleToggleCurrentPassword}
                                  edge="end"
                                >
                                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="newPassword"
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          helperText={touched.newPassword && errors.newPassword}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleToggleNewPassword}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="confirmPassword"
                          label="Confirm New Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleToggleConfirmPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <LockIcon />}
                        >
                          {isSubmitting ? 'Changing...' : 'Change Password'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Two-Factor Authentication
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userData.twoFactorEnabled}
                      color="primary"
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
                
                {userData.twoFactorEnabled && (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Enabled" 
                    color="success" 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
              </Typography>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                Danger Zone
              </Typography>
              
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteAccountDialogOpen(true)}
              >
                Delete Account
              </Button>
            </TabPanel>
            
            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Appearance
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {darkMode ? (
                        <>
                          <DarkModeIcon sx={{ mr: 1 }} />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <LightModeIcon sx={{ mr: 1 }} />
                          Light Mode
                        </>
                      )}
                    </Box>
                  }
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Choose between light and dark mode for your banking interface.
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Language
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                  <InputLabel id="language-select-label">Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={userData.language}
                    label="Language"
                    startAdornment={
                      <InputAdornment position="start">
                        <LanguageIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="zh">中文</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Select your preferred language for the application interface.
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userData.notificationsEnabled}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationsIcon sx={{ mr: 1 }} />
                      Enable Notifications
                    </Box>
                  }
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Receive notifications about account activity, security alerts, and important updates.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Sessions Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Active Sessions
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                These are the devices that are currently logged into your account. If you don't recognize a session, you should log out of it and change your password immediately.
              </Typography>
              
              <List>
                {userData.sessions.map((session) => (
                  <Paper 
                    key={session.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: session.current ? '1px solid' : 'none',
                      borderColor: session.current ? 'primary.main' : 'transparent'
                    }}
                  >
                    <ListItem 
                      alignItems="flex-start"
                      secondaryAction={
                        session.current ? (
                          <Chip label="Current Session" color="primary" size="small" />
                        ) : (
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                          >
                            Log Out
                          </Button>
                        )
                      }
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DevicesIcon sx={{ mr: 1 }} />
                            {session.device}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {session.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div">
                              Last active: {formatDate(session.lastActive)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out of your account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Are you sure you want to delete your account? This action cannot be undone.</Typography>
          <Typography variant="body2" color="text.secondary">
            All your personal data, transaction history, and account settings will be permanently removed from our system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Avatar Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={handleCloseAvatarDialog}
      >
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Upload a new profile picture</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CameraAltIcon />}
            sx={{ mt: 2 }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept="image/*"
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvatarDialog}>Cancel</Button>
          <Button color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;