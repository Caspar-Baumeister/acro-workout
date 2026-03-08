/**
 * Firebase exports
 * 
 * Client module: lib/firebase/client.ts - for client-side Firebase features
 * Admin module: lib/firebase/admin.ts - for server-side Firestore (server-only)
 * 
 * IMPORTANT: Do not import admin.ts in client components
 */

// Re-export client utilities for client-side usage
export { getFirebaseApp, getFirebaseAnalytics } from './client';

// Note: Admin functions should be imported directly from './admin' in server code
// to ensure proper tree-shaking and avoid bundling server code in client
