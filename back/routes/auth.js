import express from 'express';
import { AttemptAuth, FetchUserToken, OfferVerify, CreateUserToken } from '../firebase.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post('/login', async (request, response) => {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ 
      error: 'Missing credentials',
      message: 'Username and password are required' 
    });
  }

  try {
    const authenticated = await AttemptAuth(username, password);
    
    if (authenticated) {
      let token = await FetchUserToken(username);
      
      // Check if user needs verification
      if (token && token.substr(0, 11) === "validation=") {
        await OfferVerify(username, token);
        response.status(202);
        response.send("UNV"); // User needs to verify
      } else if (token) {
        response.status(200);
        response.json({ username, token });
      } else {
        // Create new token if none exists
        token = await CreateUserToken(username);
        if (token) {
          response.status(200);
          response.json({ username, token });
        } else {
          response.status(202);
          response.send("UNV");
        }
      }
    } else {
      response.status(202);
      response.send("ILD"); // Incorrect login details
    }
  } catch (error) {
    console.error('Login error:', error);
    response.status(202);
    response.send(error.message);
  }
});

/**
 * POST /api/auth/verify
 * Verify authentication token
 */
router.post('/verify', async (request, response) => {
  const { token } = request.body;

  if (!token) {
    return response.status(401).json({ 
      valid: false,
      message: 'No token provided' 
    });
  }

  try {
    const { VerifyToken } = await import('../firebase.js');
    const isValid = await VerifyToken(token);
    
    response.json({ valid: isValid });
  } catch (error) {
    console.error('Token verification error:', error);
    response.status(500).json({ 
      valid: false,
      message: 'Token verification failed' 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 */
router.post('/logout', async (request, response) => {
  // In a real implementation, you would invalidate the token
  // For now, just return success
  response.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

export default router;
