import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB || 'weddinglk')
}

export async function closeConnection(): Promise<void> {
  const client = await clientPromise
  await client.close()
}

// Health check function
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  message: string
  responseTime: number
}> {
  const startTime = Date.now()
  
  try {
    const db = await getDb()
    await db.admin().ping()
    
    const responseTime = Date.now() - startTime
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown database error',
      responseTime
    }
  }
}

// Connection pool monitoring
export async function getConnectionStats(): Promise<{
  activeConnections: number
  availableConnections: number
  pendingConnections: number
}> {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'weddinglk')
    
    // Get connection pool statistics
    const stats = await db.admin().serverStatus()
    
    return {
      activeConnections: stats.connections?.active || 0,
      availableConnections: stats.connections?.available || 0,
      pendingConnections: stats.connections?.pending || 0
    }
  } catch (error) {
    console.error('Error getting connection stats:', error)
    return {
      activeConnections: 0,
      availableConnections: 0,
      pendingConnections: 0
    }
  }
}
