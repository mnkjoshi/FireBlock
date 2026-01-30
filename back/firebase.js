import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
// Note: You'll need to download your Firebase service account key
// and set the path in the .env file
let db;

try {
  // Check if service account file exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    db = admin.database();
    console.log('✓ Firebase Admin initialized');
  } else {
    console.warn('⚠️  Firebase credentials not configured. Using mock authentication.');
  }
} catch (error) {
  console.warn('⚠️  Firebase initialization failed. Using mock authentication.');
  console.warn('Error:', error.message);
}

/**
 * Attempt to authenticate user
 */
export async function AttemptAuth(username, password) {
  if (!db) {
    // Mock authentication for development
    return username === 'admin' && password === 'admin123';
  }

  try {
    const userRef = db.ref(`users/${username}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (!userData) {
      return false;
    }

    // In production, use proper password hashing (bcrypt)
    // This is simplified for demo
    return userData.password === password;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}

/**
 * Fetch user token
 */
export async function FetchUserToken(username) {
  if (!db) {
    // Mock token for development
    return `token_${username}_${Date.now()}`;
  }

  try {
    const userRef = db.ref(`users/${username}/token`);
    const snapshot = await userRef.once('value');
    return snapshot.val() || `token_${username}_${Date.now()}`;
  } catch (error) {
    console.error('Token fetch error:', error);
    return null;
  }
}

/**
 * Create or update user token
 */
export async function CreateUserToken(username) {
  const token = `token_${username}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  if (!db) {
    return token;
  }

  try {
    await db.ref(`users/${username}/token`).set(token);
    return token;
  } catch (error) {
    console.error('Token creation error:', error);
    return null;
  }
}

/**
 * Offer email verification (placeholder)
 */
export async function OfferVerify(username, token) {
  console.log(`Verification email would be sent to ${username}`);
  // Implement email verification logic here
  return true;
}

/**
 * Verify user token
 */
export async function VerifyToken(token) {
  if (!db) {
    // Mock verification - just check if token exists
    return token && token.startsWith('token_');
  }

  try {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('token').equalTo(token).once('value');
    return snapshot.exists();
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export { admin, db };
