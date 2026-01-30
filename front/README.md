# FireBlock Frontend

React + Vite frontend application for FireBlock - Immutable Fire Safety Records.

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
front/
├── src/
│   ├── components/         # Reusable components
│   │   └── ConfirmationModal.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── LedgerPage.jsx
│   │   └── AdminPage.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles & design system
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies

```

## Design System

### Color Palette
- **Base (Background):** `#FDFCF5` - Warm Alabaster/Off-White
- **Primary (Action/Alerts):** `#FF4500` - Orange-Red
- **Text:** `#121212` - Ink Black
- **Secondary:** `#E0E0E0` - Light Gray

### Typography
- **Primary Font:** Inter, Roboto, sans-serif
- **Monospace Font:** Monaco, Courier New (for Block IDs and data)

## Features

### Pages

1. **Landing Page** - Public homepage with mission statement
2. **Login Page** - Authentication portal
3. **Ledger Display** - Main dashboard showing blockchain ledger entries
4. **Admin Panel** - Protected panel for manual entry and nullification

### Components

- **ConfirmationModal** - High-friction confirmation for destructive actions
- **ProtectedRoute** - Route wrapper for authentication

### States Implemented

- Loading States (Skeleton loaders)
- Empty States (No data)
- Error States (API failures)
- Success States (Confirmation messages)

## Tech Stack

- React 18
- React Router DOM
- Vite
- CSS (No preprocessors, following design system)

## API Integration

The frontend is configured to proxy API requests to `http://localhost:5000` in development mode.

Update API endpoints in components when backend routes are implemented.
