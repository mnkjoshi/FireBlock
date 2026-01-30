# FireBlock - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed
- Git (optional)

### 1. Install Backend Dependencies

```bash
cd back
npm install
```

### 2. Install Frontend Dependencies

```bash
cd front
npm install
```

### 3. Start the Backend Server

```bash
cd back
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Start the Frontend (New Terminal)

```bash
cd front
npm run dev
```

Frontend will run on `http://localhost:3000` (or `http://localhost:5173` with Vite)

## Default Login Credentials

Since Firebase is not configured by default, use mock authentication:

- **Username:** `admin`
- **Password:** `admin123`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Click "Login" or "Access Ledger"
3. Enter credentials: `admin` / `admin123`
4. Explore the Ledger Display (blockchain entries)
5. Try the Admin Panel:
   - Add manual entries
   - Nullify existing entries (requires confirmation)

## API Testing

You can test the API directly:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Ledger
```bash
curl http://localhost:5000/api/ledger
```

### Add Entry (requires token)
```bash
curl -X POST http://localhost:5000/api/admin/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sensorName": "Sensor-Test",
    "eventType": "Status",
    "temperature": 75,
    "smokeLevel": 0,
    "severity": 2
  }'
```

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

**Backend:**
Edit `back/.env` and change `PORT=5000` to another port

**Frontend:**
Edit `front/vite.config.js` and change the port in server config

### CORS Errors
Make sure both frontend and backend are running and the backend allows the frontend origin in `server.js`

### Module Errors
Run `npm install` again in both `back/` and `front/` directories

## Optional: Firebase Setup

To use real Firebase authentication instead of mock auth:

1. Create Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Download service account JSON
4. Add to `back/.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```

## Next Steps

- Add sensor devices to send data to the blockchain
- Implement WebSocket for real-time updates
- Deploy to production (see deployment guides)
- Configure Firebase for production authentication
