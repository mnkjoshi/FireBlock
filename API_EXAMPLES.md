# FireBlock API Examples

## Authentication

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "username": "admin",
  "token": "token_admin_1738259400000"
}
```

### Verify Token
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE"
  }'
```

## Ledger Operations

### Get All Entries
```bash
curl http://localhost:5000/api/ledger
```

### Get Specific Entry
```bash
curl http://localhost:5000/api/ledger/BLK001
```

### Validate Chain
```bash
curl http://localhost:5000/api/ledger/validate/chain
```

## Admin Operations

### Add Manual Entry
```bash
curl -X POST http://localhost:5000/api/admin/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sensorName": "Sensor-A-Floor2",
    "eventType": "Trigger",
    "temperature": 95,
    "smokeLevel": 8,
    "severity": 9
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Block successfully added to ledger",
  "block": {
    "id": "BLK004",
    "timestamp": "2026-01-30T20:30:00.000Z",
    "hash": "00abc...",
    "data": {...}
  }
}
```

### Nullify Entry
```bash
curl -X PATCH http://localhost:5000/api/admin/nullify/BLK001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "reason": "Administrative nullification - duplicate entry"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Nullification block created for BLK001",
  "nullificationBlock": {
    "id": "BLK005",
    "timestamp": "2026-01-30T20:35:00.000Z",
    "hash": "00def...",
    "nullifies": "BLK001"
  }
}
```

### Get Statistics
```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBlocks": 10,
    "highSeverityCount": 2,
    "mediumSeverityCount": 3,
    "lowSeverityCount": 5,
    "nullifiedCount": 1,
    "manualEntriesCount": 2,
    "chainValid": true,
    "lastBlockTimestamp": "2026-01-30T20:35:00.000Z"
  }
}
```

## Using with JavaScript/Frontend

### Login
```javascript
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  if (response.status === 200) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }
};
```

### Get Ledger
```javascript
const getLedger = async () => {
  const response = await fetch('/api/ledger');
  const data = await response.json();
  return data.entries;
};
```

### Add Entry
```javascript
const addEntry = async (entryData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/admin/entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(entryData)
  });

  return await response.json();
};
```

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Missing required fields",
  "required": ["sensorName", "eventType", "temperature", "smokeLevel", "severity"]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Admin access required"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Block BLK999 not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Failed to add block to ledger",
  "error": "Error details here"
}
```
