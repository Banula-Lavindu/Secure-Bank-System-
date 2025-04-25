# Modern Banking System Frontend

A professional, colorful, and responsive banking system frontend with a modern design that works well on both desktop and mobile devices.

## Features

- Secure login with 2FA/OTP verification
- User dashboard with account overview
- Transaction history with filtering and export options
- Fund transfer functionality
- Profile and account settings management
- Statements and reports with visual charts
- Responsive design for mobile and desktop
- Admin panel for bank staff (optional)
- Notifications system
- Support and contact page
- Error handling pages
- Registration for new users
- Dark mode toggle
- Session timeout warnings

## Tech Stack

- React 18
- Vite (build tool)
- React Router for navigation
- Material UI for components
- Chart.js for data visualization
- Formik & Yup for form validation
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd banking-system-frontend

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles
├── utils/          # Utility functions
├── App.jsx         # Main application component
├── main.jsx        # Entry point
└── routes.jsx      # Application routes
```

## Design Guidelines

- Primary color: #1976d2 (Blue)
- Secondary color: #f50057 (Pink)
- Success color: #4caf50 (Green)
- Warning color: #ff9800 (Orange)
- Error color: #f44336 (Red)
- Background: Light mode - #f5f5f5, Dark mode - #121212

## License

MIT