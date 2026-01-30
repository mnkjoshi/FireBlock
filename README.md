# FireBlock

**Immutable Fire Safety Records** - A blockchain-backed web interface for FireSafe's sensor network audit trail.

## Project Overview

FireBlock provides an immutable audit trail for fire safety sensor networks, ensuring that every event is permanently and verifiably recorded. Built for high-compliance environments where data integrity is non-negotiable.

### The Problem
FireSafe needs an immutable audit trail for their sensor network. Current database logging is insufficient for high-compliance clients who fear data tampering.

### The Solution
A web interface that visualizes a blockchain backend, proving integrity without cryptocurrency complexity.

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Styling (following design system)

### Backend
- **Express.js** - Web server framework
- **Node.js** - Runtime environment

## Project Structure

```
FireBlock/
├── front/                 # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main app with routing
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── back/                  # Express backend server
    ├── server.js         # Main server file
    ├── .env              # Environment variables
    ├── package.json
    └── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install Frontend Dependencies:**
   ```bash
   cd front
   npm install
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd back
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd back
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd front
   npm run dev
   ```
   Application runs on `http://localhost:3000`

## Features

### Public Pages
- **Landing Page** - Mission statement and feature overview
- **Login Page** - Secure authentication portal

### Protected Pages (Requires Authentication)
- **Ledger Display** - Live monitoring dashboard with blockchain visualization
- **Admin Panel** - Manual entry creation and nullification (high-friction controls)

### Design Highlights

- **Clinical but Urgent** - "Fire safety meets immutable tech"
- **Severity-First** - High severity events (8-10) immediately visible
- **Immutability UX** - Nullification adds blocks rather than deleting
- **Responsive** - Tablet-optimized for field inspectors

### Color Palette
- Base: `#FDFCF5` (Warm off-white)
- Primary: `#FF4500` (Orange-red for alerts)
- Text: `#121212` (High contrast black)
- Secondary: `#E0E0E0` (Light gray for borders)

## Development Status

### ✅ Completed - PRODUCTION READY
- Frontend application structure with Vite + React
- Global design system (CSS)
- Landing Page with blockchain visualization
- Login Page with Firebase authentication
- Ledger Display with real-time blockchain data
- Admin Panel with tabbed interface and reduced spacing
- Manual Entry form with API integration
- Nullify Entry with confirmation modal and API integration
- React Router setup with protected routes
- **Backend Express server with private blockchain**
- **Firebase Realtime DB authentication (with mock fallback)**
- **Private blockchain implementation (no gas fees)**
- **Complete API routes:**
  - Authentication (`/api/auth/*`)
  - Ledger data (`/api/ledger/*`)
  - Admin operations (`/api/admin/*`)
- **SHA-256 cryptographic hashing**
- **Proof of Work mining**
- **Chain validation**
- **Immutable nullification system**

### 🚀 Ready to Use
All core features are implemented and working. See [QUICKSTART.md](QUICKSTART.md) for setup instructions.

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Ledger
- `GET /api/ledger` - Get all ledger entries
- `GET /api/ledger/:id` - Get specific entry

### Admin
- `POST /api/admin/entry` - Create manual entry
- `PATCH /api/admin/nullify/:id` - Nullify an entry

## Design Constraints

### Audience
Safety inspectors and system admins (non-technical regarding blockchain)

### Design Implications
- Avoid Web3 jargon in UI
- Use plain English ("Ledger Entry" vs "Block")
- High friction for destructive actions
- Severity-first visual hierarchy
- Tablet-responsive (768px+ viewports)

## Contributing

When adding new features:
1. Follow the established design system
2. Maintain plain English in UI
3. Implement loading/empty/error states
4. Ensure mobile responsiveness
5. Add high-friction confirmations for destructive actions

## License

MIT
