import mongoose from 'mongoose';
import { runDataMigration } from '../services/migrationService';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_MONGODB_URI') || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️ [MongoDB] MONGODB_URI is not set or contains placeholder credentials in .env.');
    console.warn('📌 To connect to MongoDB Atlas:');
    console.warn('   1. Create a free cluster at https://cloud.mongodb.com/');
    console.warn('   2. Add Network Access (allow IP 0.0.0.0/0 or your IP).');
    console.warn('   3. Create a Database User and copy your connection string.');
    console.warn('   4. Set MONGODB_URI in your .env file.');
    console.warn('ℹ️ Running with local JSON fallback storage until MONGODB_URI is configured.\n');
    return false;
  }

  try {
    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });

    isConnected = true;
    const dbName = mongoose.connection.name || 'movement-craft';
    const dbHost = mongoose.connection.host || 'MongoDB Atlas';
    console.log(`✅ [MongoDB] Successfully connected to database: "${dbName}" on host: ${dbHost}`);

    // Run safe data migration from local JSON / defaults into MongoDB
    await runDataMigration();

    return true;
  } catch (error: any) {
    isConnected = false;
    console.error('❌ [MongoDB] Connection error:', error.message);
    console.warn('ℹ️ Running in fallback mode. Server will remain active; please check your MONGODB_URI in .env.\n');
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ [MongoDB] Disconnected from MongoDB Atlas.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ [MongoDB] Runtime connection error:', err.message);
});

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getDbStatus(): {
  connected: boolean;
  state: string;
  database: string;
  host: string;
} {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    connected: isDbConnected(),
    state: states[stateCode] || 'unknown',
    database: isDbConnected() ? (mongoose.connection.name || 'movement-craft') : 'none (fallback mode)',
    host: isDbConnected() ? (mongoose.connection.host || 'MongoDB Atlas') : 'local fallback'
  };
}

