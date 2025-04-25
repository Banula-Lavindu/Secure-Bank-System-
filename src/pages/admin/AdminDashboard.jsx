import React from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';

const AdminDashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { title: 'Total Users', value: '2,345', icon: <PeopleIcon />, color: 'primary.main' },
    { title: 'Active Accounts', value: '1,987', icon: <AccountBalanceIcon />, color: 'success.main' },
    { title: 'Security Alerts', value: '7', icon: <SecurityIcon />, color: 'warning.main' },
    { title: 'System Health', value: '98%', icon: <SettingsIcon />, color: 'info.main' }
  ];

  const recentUsers = [
    { id: 1, name: 'saman kumara', email: 'saman.kumara@example.com', status: 'active', joined: '2023-05-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'active', joined: '2023-05-14' },
    { id: 3, name: 'Robert samanson', email: 'robert.j@example.com', status: 'pending', joined: '2023-05-13' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', status: 'blocked', joined: '2023-05-10' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', status: 'active', joined: '2023-05-09' }
  ];

  const securityAlerts = [
    { id: 1, type: 'Failed Login Attempts', count: 3, severity: 'medium' },
    { id: 2, type: 'Suspicious Transactions', count: 2, severity: 'high' },
    { id: 3, type: 'New Device Logins', count: 5, severity: 'low' },
    { id: 4, type: 'Password Changes', count: 4, severity: 'low' }
  ];

  // Helper function to render status chip
  const renderStatusChip = (status) => {
    const statusProps = {
      active: { color: 'success', icon: null },
      pending: { color: 'warning', icon: null },
      blocked: { color: 'error', icon: <BlockIcon fontSize="small" /> }
    };
    
    return (
      <Chip 
        size="small"
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={statusProps[status].color}
        icon={statusProps[status].icon}
        variant={status === 'blocked' ? 'filled' : 'outlined'}
      />
    );
  };

  // Helper function to render severity icon
  const renderSeverityIcon = (severity) => {
    switch(severity) {
      case 'high':
        return <WarningIcon fontSize="small" color="error" />;
      case 'medium':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'low':
        return <WarningIcon fontSize="small" color="info" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="medium">Recent Users</Typography>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<PersonAddIcon />}
                component={Link}
                to="/admin/users/new"
              >
                Add User
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>{renderStatusChip(user.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                component={Link} 
                to="/admin/users"
                size="small"
              >
                View All Users
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Security Alerts */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Security Alerts
            </Typography>
            <List>
              {securityAlerts.map((alert) => (
                <React.Fragment key={alert.id}>
                  <ListItem>
                    <ListItemIcon>
                      {renderSeverityIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={alert.type}
                      secondary={`${alert.count} ${alert.count === 1 ? 'incident' : 'incidents'}`}
                    />
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                component={Link} 
                to="/admin/security"
                size="small"
              >
                View All Alerts
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;