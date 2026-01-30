# FireBlock Backend

Express.js backend server for FireBlock - Immutable Fire Safety Records with private blockchain implementation.

## Features

- ✅ **Private Blockchain**: Self-contained blockchain with no gas fees
- ✅ **Firebase Authentication**: Realtime Database integration for user auth
- ✅ **RESTful API**: Complete CRUD operations for ledger entries
- ✅ **Immutable Records**: Blockchain-based audit trail
- ✅ **Nullification System**: High-friction administrative controls

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env` and configure:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration (optional - uses mock auth if not configured)
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
# FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Default mock credentials: username=admin, password=admin123
```

### Running the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Private Blockchain

FireBlock uses a self-contained private blockchain with:
- **No Gas Fees**: No cryptocurrency required
- **SHA-256 Hashing**: Cryptographic integrity
- **Proof of Work**: Configurable difficulty (default: 2)
- **Chain Validation**: Built-in integrity checks

### Blockchain Structure

Each block contains:
```javascript
{
  index: Number,
  timestamp: ISO String,
  data: {
    sensorName: String,
    eventType: String,
    data: Object,
    severity: Number (1-10)
  },
  previousHash: String,
  hash: String,
  nonce: Number
}
```

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Authenticate user with Firebase Realtime DB

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "username": "admin",
  "token": "token_admin_1234567890"
}
```

**Response (202):**
- `"ILD"` - Incorrect Login Details
- `"UNV"` - User Needs Verification

#### POST `/api/auth/verify`
Verify authentication token

#### POST `/api/auth/logout`
Logout user

### Ledger

#### GET `/api/ledger`
Get all blockchain entries

**Response:**
```json
{
  "success": true,
  "count": 5,
  "entries": [...],
  "chainValid": true
}
```

#### GET `/api/ledger/:id`
Get specific block by ID (e.g., BLK001)

#### GET `/api/ledger/validate/chain`
Validate blockchain integrity

### Admin (Requires Authorization)

All admin routes require `Authorization: Bearer {token}` header.

#### POST `/api/admin/entry`
Manually add a new blockchain entry

**Request:**
```json
{
  "sensorName": "Sensor-A-Floor2",
  "eventType": "Trigger",
  "temperature": 95,
  "smokeLevel": 8,
  "severity": 9
}
```

#### PATCH `/api/admin/nullify/:id`
Nullify a blockchain entry (adds nullification block)

**Request:**
```json
{
  "reason": "Administrative nullification"
}
```

#### GET `/api/admin/stats`
Get blockchain statistics

## Project Structure

```
back/
├── server.js              # Main server file
├── blockchain.js          # Private blockchain implementation
├── firebase.js            # Firebase authentication utilities
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── ledger.js         # Ledger data endpoints
│   └── admin.js          # Admin operations
├── package.json
├── .env                  # Environment variables
└── README.md
```

## Firebase Setup (Optional)

If you want to use real Firebase authentication:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Download service account key (Settings > Service Accounts)
4. Add to `.env`:
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```

If Firebase is not configured, the system uses mock authentication:
- Username: `admin`
- Password: `admin123`

## Blockchain Operations

### Adding a Block
When a new entry is added via `/api/admin/entry`, the blockchain:
1. Creates a new block with the data
2. Links it to the previous block via hash
3. Mines the block (Proof of Work)
4. Validates the chain integrity

### Nullification
Nullification doesn't delete blocks (immutable). Instead:
1. Creates a new "nullification block"
2. References the target block
3. Marks the target as nullified (metadata only)
4. Preserves original block data

## Tech Stack

- **Express.js** - Web framework
- **Firebase Admin SDK** - Authentication
- **Node.js Crypto** - SHA-256 hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment management

## Security Notes

⚠️ **For Production:**
- Implement proper password hashing (bcrypt)
- Use JWT tokens instead of simple tokens
- Add rate limiting
- Enable HTTPS
- Implement proper session management
- Add input validation and sanitization
