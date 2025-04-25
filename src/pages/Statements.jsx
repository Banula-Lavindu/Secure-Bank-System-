import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// Icons
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Mock data for statements
const generateStatements = () => {
  const currentYear = new Date().getFullYear();
  const statements = [];
  
  // Generate statements for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    statements.push({
      id: i + 1,
      month: month,
      year: year,
      dateGenerated: new Date(year, month, 15).toISOString(),
      totalIncome: Math.random() * 5000 + 3000,
      totalExpenses: Math.random() * 4000 + 2000,
      balance: 0, // Will be calculated
      categories: {
        income: [
          { name: 'Salary', amount: Math.random() * 4000 + 3000 },
          { name: 'Investments', amount: Math.random() * 1000 },
          { name: 'Other', amount: Math.random() * 500 }
        ],
        expenses: [
          { name: 'Housing', amount: Math.random() * 1500 + 1000 },
          { name: 'Food', amount: Math.random() * 800 + 400 },
          { name: 'Transportation', amount: Math.random() * 500 + 200 },
          { name: 'Entertainment', amount: Math.random() * 400 + 100 },
          { name: 'Utilities', amount: Math.random() * 300 + 150 },
          { name: 'Shopping', amount: Math.random() * 600 + 200 },
          { name: 'Healthcare', amount: Math.random() * 300 + 50 },
          { name: 'Other', amount: Math.random() * 400 + 100 }
        ]
      }
    });
  }
  
  // Calculate balance for each statement
  statements.forEach(statement => {
    statement.balance = statement.totalIncome - statement.totalExpenses;
  });
  
  return statements;
};

const statements = generateStatements();

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

// Helper function to get month name
const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};

const Statements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Get unique years from statements
  const years = [...new Set(statements.map(statement => statement.year))];
  
  // Filter statements by selected year
  const filteredStatements = statements.filter(statement => statement.year === selectedYear);
  
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  
  const handleViewStatement = (statement) => {
    setSelectedStatement(statement);
    setPreviewDialogOpen(true);
  };
  
  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
  };
  
  const handleDownloadStatement = (statement) => {
    // In a real app, this would trigger a download of the statement PDF
    alert(`Downloading statement for ${getMonthName(statement.month)} ${statement.year}`);
  };
  
  const handleEmailStatement = (statement) => {
    // In a real app, this would send the statement to the user's email
    alert(`Sending statement for ${getMonthName(statement.month)} ${statement.year} to your email`);
  };
  
  // Prepare chart data for the selected statement or the most recent one
  const prepareChartData = (statement) => {
    if (!statement) return null;
    
    // Income categories data for doughnut chart
    const incomeData = {
      labels: statement.categories.income.map(cat => cat.name),
      datasets: [
        {
          data: statement.categories.income.map(cat => cat.amount),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    // Expense categories data for doughnut chart
    const expenseData = {
      labels: statement.categories.expenses.map(cat => cat.name),
      datasets: [
        {
          data: statement.categories.expenses.map(cat => cat.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    return { incomeData, expenseData };
  };
  
  // Prepare yearly trend data
  const prepareYearlyTrendData = () => {
    // Get statements for the selected year, sorted by month
    const yearStatements = [...filteredStatements].sort((a, b) => a.month - b.month);
    
    const labels = yearStatements.map(statement => getMonthName(statement.month).substring(0, 3));
    const incomeData = yearStatements.map(statement => statement.totalIncome);
    const expenseData = yearStatements.map(statement => statement.totalExpenses);
    const balanceData = yearStatements.map(statement => statement.balance);
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Balance',
          data: balanceData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    };
  };
  
  const chartData = prepareChartData(selectedStatement || statements[0]);
  const yearlyTrendData = prepareYearlyTrendData();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Statements & Reports
      </Typography>
      
      <Grid container spacing={3}>
        {/* Yearly Financial Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                {selectedYear} Financial Overview
              </Typography>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={handleYearChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ height: 300 }}>
              <Line 
                data={yearlyTrendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Financial Trend'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value).replace('.00', '');
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Monthly Statements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Monthly Statements
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Statement Period</TableCell>
                    <TableCell>Date Generated</TableCell>
                    <TableCell align="right">Income</TableCell>
                    <TableCell align="right">Expenses</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStatements.map((statement) => (
                    <TableRow key={statement.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {getMonthName(statement.month)} {statement.year}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(statement.dateGenerated)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ color: 'success.main', fontWeight: 'medium' }}
                        >
                          {formatCurrency(statement.totalIncome)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ color: 'error.main', fontWeight: 'medium' }}
                        >
                          {formatCurrency(statement.totalExpenses)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: statement.balance >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {formatCurrency(statement.balance)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewStatement(statement)}
                            title="View Statement"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleDownloadStatement(statement)}
                            title="Download PDF"
                          >
                            <GetAppIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEmailStatement(statement)}
                            title="Email Statement"
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredStatements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No statements available for {selectedYear}.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Statement Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        {selectedStatement && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Statement: {getMonthName(selectedStatement.month)} {selectedStatement.year}
              </Typography>
              <IconButton onClick={handleClosePreview} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Income
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(selectedStatement.totalIncome)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="error" gutterBottom>
                          Expenses
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(selectedStatement.totalExpenses)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Balance
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: selectedStatement.balance >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {formatCurrency(selectedStatement.balance)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Financial Breakdown
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" align="center" gutterBottom>
                    Income Sources
                  </Typography>
                  <Box sx={{ height: 300, mb: 2 }}>
                    {chartData && (
                      <Doughnut 
                        data={chartData.incomeData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedStatement.categories.income.map((category, index) => (
                          <TableRow key={index}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell align="right">{formatCurrency(category.amount)}</TableCell>
                            <TableCell align="right">
                              {((category.amount / selectedStatement.totalIncome) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" align="center" gutterBottom>
                    Expense Categories
                  </Typography>
                  <Box sx={{ height: 300, mb: 2 }}>
                    {chartData && (
                      <Doughnut 
                        data={chartData.expenseData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedStatement.categories.expenses.map((category, index) => (
                          <TableRow key={index}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell align="right">{formatCurrency(category.amount)}</TableCell>
                            <TableCell align="right">
                              {((category.amount / selectedStatement.totalExpenses) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button 
                startIcon={<PictureAsPdfIcon />}
                onClick={() => handleDownloadStatement(selectedStatement)}
              >
                Download PDF
              </Button>
              <Button 
                startIcon={<EmailIcon />}
                onClick={() => handleEmailStatement(selectedStatement)}
              >
                Email Statement
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleClosePreview}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Statements;