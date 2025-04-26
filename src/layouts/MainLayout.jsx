import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';

// Material UI imports
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;

const MainLayout = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Regular user menu items
  const regularMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Transactions', icon: <ReceiptLongIcon />, path: '/transactions' },
    { text: 'Transfer Funds', icon: <SendIcon />, path: '/transfer' },
    { text: 'Statements', icon: <DescriptionIcon />, path: '/statements' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Support', icon: <HelpIcon />, path: '/support' },
  ];
  
  // Add admin menu item if user is admin
  const menuItems = isAdmin 
    ? [...regularMenuItems, { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' }]
    : regularMenuItems;

  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Modern Bank
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
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
              {darkMode ? <DarkModeIcon fontSize="small" sx={{ mr: 1 }} /> : <LightModeIcon fontSize="small" sx={{ mr: 1 }} />}
              <Typography variant="body2">{darkMode ? 'Dark Mode' : 'Light Mode'}</Typography>
            </Box>
          }
        />
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: darkMode ? 'background.paper' : 'primary.main',
          color: darkMode ? 'text.primary' : 'white',
          boxShadow: darkMode ? 1 : 3
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            {isAdmin && location.pathname === '/admin' && ' (Admin)'}
          </Typography>
          
          <IconButton color="inherit" component={Link} to="/notifications">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            sx={{ ml: 1 }}
          >
            {user?.avatar ? (
              <Avatar alt={`${user.first_name} ${user.last_name}`} src={user.avatar} />
            ) : (
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : ''}
                {user?.last_name ? user.last_name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            )}
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            {isAdmin && (
              <MenuItem component={Link} to="/admin" onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Admin Panel</ListItemText>
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default'
        }}
      >
        <Outlet />
        
        <Box
          component="footer"
          sx={{
            py: 3,
            mt: 5,
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Modern Banking System. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;