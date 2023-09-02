import _mongoose from 'mongoose';

declare global {
  var mongoose: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof _mongoose | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
const cached = global.mongoose ?? { conn: null, promise: null };

async function dbConnection() {
  if (cached.conn !== null) {
    return cached.conn;
  }

  if (cached.promise === null) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = _mongoose.connect(MONGODB_URI, opts).then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnection;
