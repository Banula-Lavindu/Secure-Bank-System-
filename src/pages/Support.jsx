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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpIcon from '@mui/icons-material/Help';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';

// Validation schema for the support form
const SupportFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  category: Yup.string().required('Category is required'),
  message: Yup.string().required('Message is required').min(10, 'Message is too short')
});

// FAQ data
const faqData = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.'
  },
  {
    question: 'How do I transfer money to another account?',
    answer: 'To transfer money, navigate to the "Fund Transfer" page from your dashboard. Select the source account, enter the recipient details, specify the amount, and follow the confirmation steps.'
  },
  {
    question: 'What are the daily transaction limits?',
    answer: 'The default daily transaction limit is $10,000 for transfers and $2,000 for ATM withdrawals. You can request a temporary or permanent limit increase by contacting customer support.'
  },
  {
    question: 'How do I report a suspicious transaction?',
    answer: 'If you notice any suspicious activity on your account, please contact our 24/7 fraud prevention hotline immediately at 1-800-123-4567 or submit a report through the "Report Fraud" option in your account settings.'
  },
  {
    question: 'How long kumaras it take for a transfer to be processed?',
    answer: 'Internal transfers between accounts within our bank are processed immediately. External transfers to other banks typically take 1-3 business days, depending on the receiving bank.'
  },
  {
    question: 'How do I set up automatic payments?',
    answer: 'You can set up automatic payments by going to the "Payments" section and selecting "Automatic Payments". From there, you can specify the payee, amount, frequency, and start/end dates.'
  },
  {
    question: 'Is online banking secure?',
    answer: 'Yes, we employ industry-leading security measures including 256-bit encryption, two-factor authentication, and continuous monitoring to ensure your banking experience is secure. We also recommend that you regularly update your password and never share your login credentials.'
  }
];

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setFormSubmitted(true);
      resetForm();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Support
      </Typography>
      
      <Grid container spacing={3}>
        {/* Support Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: isMobile ? 3 : 0 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Contact Us
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Have a question or need assistance? Fill out the form below and our support team will get back to you as soon as possible.
            </Typography>
            
            {formSubmitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Your message has been sent successfully! Our team will contact you shortly.
              </Alert>
            )}
            
            <Formik
              initialValues={{
                name: '',
                email: '',
                subject: '',
                category: '',
                message: ''
              }}
              validationSchema={SupportFormSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="name"
                        label="Your Name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
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
                    
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="subject"
                        label="Subject"
                        error={touched.subject && Boolean(errors.subject)}
                        helperText={touched.subject && errors.subject}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth
                        error={touched.category && Boolean(errors.category)}
                      >
                        <InputLabel id="category-label">Category</InputLabel>
                        <Field
                          as={Select}
                          name="category"
                          labelId="category-label"
                          label="Category"
                        >
                          <MenuItem value=""><em>Select a category</em></MenuItem>
                          <MenuItem value="account">Account Issues</MenuItem>
                          <MenuItem value="transaction">Transaction Problems</MenuItem>
                          <MenuItem value="card">Card Services</MenuItem>
                          <MenuItem value="loan">Loan Inquiries</MenuItem>
                          <MenuItem value="technical">Technical Support</MenuItem>
                          <MenuItem value="feedback">Feedback</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Field>
                        {touched.category && errors.category && (
                          <Typography variant="caption" color="error">
                            {errors.category}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="message"
                        label="Message"
                        multiline
                        rows={5}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
        
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Contact Information
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Support"
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        1-800-123-4567
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="div">
                        Available 24/7 for urgent matters
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary="support@modernbank.com"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Business Hours"
                  secondary={
                    <>
                      <Typography variant="body2" component="div">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </Typography>
                      <Typography variant="body2" component="div">
                        Saturday: 10:00 AM - 2:00 PM
                      </Typography>
                      <Typography variant="body2" component="div">
                        Sunday: Closed
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Headquarters"
                  secondary={
                    <>
                      <Typography variant="body2" component="div">
                        123 Financial Street
                      </Typography>
                      <Typography variant="body2" component="div">
                        New York, NY 10001
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ChatIcon />}
              onClick={toggleChat}
              sx={{ mb: 2 }}
            >
              Start Live Chat
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<ForumIcon />}
            >
              Visit Community Forum
            </Button>
          </Paper>
        </Grid>
        
        {/* FAQ Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Frequently Asked Questions
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {faqData.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`faq-content-${index}`}
                    id={`faq-header-${index}`}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HelpIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Additional Resources */}
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
            Additional Resources
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    User Guides
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Step-by-step guides to help you navigate our banking services and features.
                  </Typography>
                  <Button variant="text" color="primary">
                    View Guides
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Video Tutorials
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Watch our video tutorials to learn how to use our online banking features.
                  </Typography>
                  <Button variant="text" color="primary">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Security Center
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Learn about our security measures and how to protect your account.
                  </Typography>
                  <Button variant="text" color="primary">
                    Visit Security Center
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Live Chat Widget (Simplified) */}
      {chatOpen && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 320,
            height: 400,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 5
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle1">
              <ChatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Live Chat Support
            </Typography>
            <Button
              size="small"
              color="inherit"
              onClick={toggleChat}
            >
              Close
            </Button>
          </Box>
          
          <Box sx={{ p: 2, flexGrow: 1, bgcolor: 'background.default', overflowY: 'auto' }}>
            <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 1, borderRadius: 1, maxWidth: '80%', mb: 1 }}>
              <Typography variant="body2">
                Hello! How can I help you today?
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, maxWidth: '80%', ml: 'auto', mb: 1 }}>
              <Typography variant="body2">
                I need help with my account.
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 1, borderRadius: 1, maxWidth: '80%', mb: 1 }}>
              <Typography variant="body2">
                I'd be happy to help with your account. Could you please provide more details about the issue you're experiencing?
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Button variant="contained" size="small" sx={{ ml: 1 }}>
                    Send
                  </Button>
                )
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Support;