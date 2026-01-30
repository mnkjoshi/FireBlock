import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ledgerRoutes from './routes/ledger.js';
import adminRoutes from './routes/admin.js';
import blockchain from './blockchain.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FireBlock API Server is running',
    timestamp: new Date().toISOString(),
    blockchain: {
      blocks: blockchain.chain.length,
      valid: blockchain.isChainValid()
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FireBlock API',
    version: '1.0.0',
    description: 'Backend API for FireBlock - Immutable Fire Safety Records',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        verify: 'POST /api/auth/verify',
        logout: 'POST /api/auth/logout'
      },
      ledger: {
        getAll: 'GET /api/ledger',
        getById: 'GET /api/ledger/:id',
        validate: 'GET /api/ledger/validate/chain',
        threatScore: 'GET /api/ledger/threat-score'
      },
      admin: {
        addEntry: 'POST /api/admin/entry',
        nullify: 'PATCH /api/admin/nullify/:id',
        stats: 'GET /api/admin/stats'
      }
    }
  });
});

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/admin', adminRoutes);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('');
  console.log('🔥 FireBlock Backend Server');
  console.log('================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================');
  console.log('');
});

export default app;
