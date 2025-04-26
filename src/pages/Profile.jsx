import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import accountService from '../services/accountService';

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
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required')
});

// Password Change Form Schema
const PasswordChangeSchema = Yup.object().shape({
  current_password: Yup.string().required('Current password is required'),
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleTheme, language, changeLanguage } = useContext(ThemeContext);
  const { user, updateUser, logout: authLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [userSessions, setUserSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Fetch active sessions when the component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      if (user) {
        setLoadingSessions(true);
        try {
          // In a real implementation, this would fetch from the API
          const response = await accountService.getActiveSessions();
          setUserSessions(response || []);
        } catch (error) {
          console.error('Failed to load active sessions:', error);
        } finally {
          setLoadingSessions(false);
        }
      }
    };
    
    fetchSessions();
  }, [user]);
  
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
      setProfileUpdateError('');
      // Update user profile using the auth service
      await updateUser(values);
      setProfileUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setProfileUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileUpdateError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      setPasswordChangeError('');
      // Call the password change API
      await authService.changePassword({
        current_password: values.current_password,
        new_password: values.new_password
      });
      
      setPasswordChangeSuccess(true);
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordChangeError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // If logout fails on the API side, still clear local session
      navigate('/login');
    }
    setLogoutDialogOpen(false);
  };
  
  const handleDeleteAccount = async () => {
    try {
      // Call the API to delete the account
      await authService.deleteAccount();
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
    }
    setDeleteAccountDialogOpen(false);
  };
  
  const handleUpdatePreferences = async (preferences) => {
    try {
      await accountService.updatePreferences(preferences);
      // Update the user context if needed
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };
  
  const handleChangeLanguage = async (event) => {
    const newLanguage = event.target.value;
    try {
      await handleUpdatePreferences({ language: newLanguage });
      // Update the ThemeContext language state
      changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  const handleToggleNotifications = async (event) => {
    const enabled = event.target.checked;
    try {
      await handleUpdatePreferences({ notificationsEnabled: enabled });
      // If you have the user in context, update that as well
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }
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
              {user.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={`${user.first_name} ${user.last_name}`}
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
                  {user.first_name ? user.first_name.charAt(0) : ''}
                  {user.last_name ? user.last_name.charAt(0) : ''}
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
              {user.first_name} {user.last_name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {user.phone}
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
                  first_name: user?.first_name || '',
                  last_name: user?.last_name || '',
                  email: user?.email || '',
                  phone: user?.phone || ''
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
                          name="first_name"
                          label="First Name"
                          error={touched.first_name && Boolean(errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="last_name"
                          label="Last Name"
                          error={touched.last_name && Boolean(errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
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
                  current_password: '',
                  new_password: '',
                  confirm_password: ''
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
                          name="current_password"
                          label="Current Password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          error={touched.current_password && Boolean(errors.current_password)}
                          helperText={touched.current_password && errors.current_password}
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
                          name="new_password"
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          error={touched.new_password && Boolean(errors.new_password)}
                          helperText={touched.new_password && errors.new_password}
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
                          name="confirm_password"
                          label="Confirm New Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          error={touched.confirm_password && Boolean(errors.confirm_password)}
                          helperText={touched.confirm_password && errors.confirm_password}
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
                      checked={user.two_factor_enabled}
                      color="primary"
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
                
                {user.two_factor_enabled && (
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
                    value={user.language || 'en'}
                    onChange={handleChangeLanguage}
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
                      checked={user.notifications_enabled}
                      onChange={handleToggleNotifications}
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
                {userSessions.map((session) => (
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