import { getDb } from './mongodb'

export interface IndexConfig {
  collection: string
  indexes: Array<{
    keys: Record<string, 1 | -1>
    options?: {
      unique?: boolean
      sparse?: boolean
      background?: boolean
      name?: string
    }
  }>
}

export class DatabasePerformanceOptimizer {
  private db: any

  constructor() {
    this.db = null
  }

  async initialize() {
    this.db = await getDb()
  }

  // Create optimized indexes for better query performance
  async createPerformanceIndexes() {
    if (!this.db) await this.initialize()

    const indexConfigs: IndexConfig[] = [
      // Users collection indexes
      {
        collection: 'users',
        indexes: [
          { keys: { email: 1 }, options: { unique: true, name: 'email_unique' } },
          { keys: { role: 1 }, options: { name: 'role_index' } },
          { keys: { location: 1 }, options: { name: 'location_index' } },
          { keys: { createdAt: -1 }, options: { name: 'created_at_desc' } },
          { keys: { lastActive: -1 }, options: { name: 'last_active_desc' } },
          { keys: { status: 1 }, options: { name: 'status_index' } }
        ]
      },
      // Venues collection indexes
      {
        collection: 'venues',
        indexes: [
          { keys: { location: 1 }, options: { name: 'venue_location' } },
          { keys: { capacity: 1 }, options: { name: 'venue_capacity' } },
          { keys: { pricePerGuest: 1 }, options: { name: 'venue_price' } },
          { keys: { rating: -1 }, options: { name: 'venue_rating_desc' } },
          { keys: { features: 1 }, options: { name: 'venue_features' } },
          { keys: { availability: 1 }, options: { name: 'venue_availability' } },
          { keys: { location: 1, capacity: 1, pricePerGuest: 1 }, options: { name: 'venue_search_compound' } }
        ]
      },
      // Bookings collection indexes
      {
        collection: 'bookings',
        indexes: [
          { keys: { userId: 1 }, options: { name: 'booking_user' } },
          { keys: { venueId: 1 }, options: { name: 'booking_venue' } },
          { keys: { eventDate: 1 }, options: { name: 'booking_date' } },
          { keys: { status: 1 }, options: { name: 'booking_status' } },
          { keys: { paymentStatus: 1 }, options: { name: 'booking_payment' } },
          { keys: { createdAt: -1 }, options: { name: 'booking_created_desc' } },
          { keys: { venueId: 1, eventDate: 1 }, options: { name: 'venue_date_compound' } },
          { keys: { userId: 1, status: 1 }, options: { name: 'user_status_compound' } }
        ]
      },
      // Wedding packages indexes
      {
        collection: 'wedding_packages',
        indexes: [
          { keys: { category: 1 }, options: { name: 'package_category' } },
          { keys: { price: 1 }, options: { name: 'package_price' } },
          { keys: { guestCapacity: 1 }, options: { name: 'package_capacity' } },
          { keys: { rating: -1 }, options: { name: 'package_rating_desc' } },
          { keys: { isBoosted: 1 }, options: { name: 'package_boosted' } },
          { keys: { location: 1, price: 1 }, options: { name: 'package_location_price' } }
        ]
      },
      // Social feed indexes
      {
        collection: 'posts',
        indexes: [
          { keys: { userId: 1 }, options: { name: 'post_user' } },
          { keys: { venueId: 1 }, options: { name: 'post_venue' } },
          { keys: { createdAt: -1 }, options: { name: 'post_created_desc' } },
          { keys: { likes: -1 }, options: { name: 'post_likes_desc' } },
          { keys: { hashtags: 1 }, options: { name: 'post_hashtags' } },
          { keys: { location: 1, createdAt: -1 }, options: { name: 'post_location_time' } }
        ]
      },
      // Payments indexes
      {
        collection: 'payments',
        indexes: [
          { keys: { bookingId: 1 }, options: { name: 'payment_booking' } },
          { keys: { userId: 1 }, options: { name: 'payment_user' } },
          { keys: { status: 1 }, options: { name: 'payment_status' } },
          { keys: { createdAt: -1 }, options: { name: 'payment_created_desc' } },
          { keys: { amount: 1 }, options: { name: 'payment_amount' } },
          { keys: { transactionId: 1 }, options: { unique: true, name: 'payment_transaction_unique' } }
        ]
      }
    ]

    for (const config of indexConfigs) {
      await this.createCollectionIndexes(config)
    }
  }

  private async createCollectionIndexes(config: IndexConfig) {
    try {
      const collection = this.db.collection(config.collection)
      
      for (const index of config.indexes) {
        const indexName = index.options?.name || Object.keys(index.keys).join('_')
        
        try {
          await collection.createIndex(index.keys, {
            ...index.options,
            background: true // Create indexes in background
          })
          console.log(`✅ Created index: ${config.collection}.${indexName}`)
        } catch (error: any) {
          if (error.code === 85) { // Index already exists
            console.log(`ℹ️  Index already exists: ${config.collection}.${indexName}`)
          } else {
            console.error(`❌ Failed to create index ${config.collection}.${indexName}:`, error.message)
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error creating indexes for ${config.collection}:`, error)
    }
  }

  // Query optimization utilities
  async optimizeQueries() {
    if (!this.db) await this.initialize()

    // Create aggregation pipelines for common queries
    await this.createAggregationPipelines()
    
    // Create read replicas for heavy queries
    await this.setupReadReplicas()
    
    // Setup query caching
    await this.setupQueryCaching()
  }

  private async createAggregationPipelines() {
    // Venue search aggregation
    const venueSearchPipeline = [
      {
        $match: {
          status: 'active',
          isVerified: true
        }
      },
      {
        $addFields: {
          searchScore: {
            $add: [
              { $multiply: ['$rating', 0.4] },
              { $multiply: [{ $divide: ['$reviewCount', 100] }, 0.3] },
              { $multiply: [{ $divide: [1000000, '$pricePerGuest'] }, 0.3] }
            ]
          }
        }
      },
      {
        $sort: { searchScore: -1 }
      }
    ]

    // Store pipeline for reuse
    this.db.collection('venues').aggregationPipelines = {
      search: venueSearchPipeline
    }
  }

  private async setupReadReplicas() {
    // In a production environment, this would configure read replicas
    console.log('📖 Read replica configuration would be set up here')
  }

  private async setupQueryCaching() {
    // Setup query result caching
    console.log('💾 Query caching would be configured here')
  }

  // Performance monitoring
  async getPerformanceMetrics() {
    if (!this.db) await this.initialize()

    try {
      const stats = await this.db.stats()
      const collections = await this.db.listCollections().toArray()
      
      const metrics = {
        database: {
          name: stats.db,
          collections: stats.collections,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexes: stats.indexes,
          indexSize: stats.indexSize
        },
        collections: await Promise.all(
          collections.map(async (col: any) => {
            const colStats = await this.db.collection(col.name).stats()
            return {
              name: col.name,
              count: colStats.count,
              size: colStats.size,
              avgObjSize: colStats.avgObjSize,
              indexes: colStats.nindexes,
              indexSize: colStats.totalIndexSize
            }
          })
        )
      }

      return metrics
    } catch (error) {
      console.error('❌ Error getting performance metrics:', error)
      return null
    }
  }

  // Query performance analysis
  async analyzeQueryPerformance(query: any, collection: string) {
    if (!this.db) await this.initialize()

    try {
      const explainResult = await this.db.collection(collection).find(query).explain('executionStats')
      
      const analysis = {
        query: query,
        collection: collection,
        executionTime: explainResult.executionStats.executionTimeMillis,
        documentsExamined: explainResult.executionStats.totalDocsExamined,
        documentsReturned: explainResult.executionStats.nReturned,
        indexUsed: explainResult.executionStats.totalKeysExamined > 0,
        keysExamined: explainResult.executionStats.totalKeysExamined,
        stages: explainResult.executionStats.executionStages
      }

      // Performance recommendations
      const recommendations = []
      
      if (analysis.executionTime > 100) {
        recommendations.push('Query is slow (>100ms), consider adding indexes')
      }
      
      if (analysis.documentsExamined > analysis.documentsReturned * 10) {
        recommendations.push('Query examines many documents, optimize with better indexes')
      }
      
      if (!analysis.indexUsed) {
        recommendations.push('Query not using indexes, add appropriate indexes')
      }

      return { analysis, recommendations }
    } catch (error) {
      console.error('❌ Error analyzing query performance:', error)
      return null
    }
  }

  // Cleanup and maintenance
  async performMaintenance() {
    if (!this.db) await this.initialize()

    try {
      // Compact collections
      const collections = await this.db.listCollections().toArray()
      
      for (const col of collections) {
        try {
          await this.db.collection(col.name).compact()
          console.log(`🧹 Compacted collection: ${col.name}`)
        } catch (error: any) {
          if (error.code !== 20) { // Not a command error
            console.error(`❌ Error compacting ${col.name}:`, error.message)
          }
        }
      }

      // Update statistics
      await this.db.command({ collStats: '*' })
      console.log('📊 Updated collection statistics')
      
    } catch (error) {
      console.error('❌ Error during maintenance:', error)
    }
  }
}

// Export singleton instance
export const dbOptimizer = new DatabasePerformanceOptimizer()

// Auto-initialize on import
dbOptimizer.initialize().catch(console.error)
