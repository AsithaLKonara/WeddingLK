#!/usr/bin/env node

/**
 * Database Monitoring Script for WeddingLK
 * Monitors database queries, performance, and connection status
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Monitoring configuration
const MONITOR_CONFIG = {
  checkInterval: 5000, // 5 seconds
  logQueries: true,
  logPerformance: true,
  alertThreshold: 1000 // Alert if query takes longer than 1 second
};

// Monitoring data storage
const monitoringData = {
  startTime: new Date(),
  connections: [],
  queries: [],
  performance: {
    avgQueryTime: 0,
    slowQueries: 0,
    totalQueries: 0
  },
  alerts: []
};

// Utility functions
const logEvent = (type, message, data = {}) => {
  const timestamp = new Date();
  const event = {
    timestamp,
    type,
    message,
    data
  };
  
  monitoringData[type === 'query' ? 'queries' : 'connections'].push(event);
  
  console.log(`[${timestamp.toISOString()}] ${type.toUpperCase()}: ${message}`);
  
  // Check for performance alerts
  if (type === 'query' && data.duration > MONITOR_CONFIG.alertThreshold) {
    const alert = {
      timestamp,
      type: 'slow_query',
      message: `Slow query detected: ${data.duration}ms`,
      data
    };
    monitoringData.alerts.push(alert);
    console.log(`🚨 ALERT: ${alert.message}`);
  }
};

const calculatePerformanceMetrics = () => {
  if (monitoringData.queries.length === 0) return;
  
  const totalTime = monitoringData.queries.reduce((sum, q) => sum + (q.data.duration || 0), 0);
  const slowQueries = monitoringData.queries.filter(q => (q.data.duration || 0) > MONITOR_CONFIG.alertThreshold).length;
  
  monitoringData.performance.avgQueryTime = totalTime / monitoringData.queries.length;
  monitoringData.performance.slowQueries = slowQueries;
  monitoringData.performance.totalQueries = monitoringData.queries.length;
};

const displayStats = () => {
  calculatePerformanceMetrics();
  
  console.log('\n📊 DATABASE MONITORING STATS');
  console.log('==============================');
  console.log(`Monitoring Duration: ${((Date.now() - monitoringData.startTime.getTime()) / 1000).toFixed(0)}s`);
  console.log(`Total Connections: ${monitoringData.connections.length}`);
  console.log(`Total Queries: ${monitoringData.performance.totalQueries}`);
  console.log(`Average Query Time: ${monitoringData.performance.avgQueryTime.toFixed(2)}ms`);
  console.log(`Slow Queries (>${MONITOR_CONFIG.alertThreshold}ms): ${monitoringData.performance.slowQueries}`);
  console.log(`Active Alerts: ${monitoringData.alerts.length}`);
  
  // Show recent alerts
  if (monitoringData.alerts.length > 0) {
    console.log('\n🚨 RECENT ALERTS:');
    monitoringData.alerts.slice(-5).forEach(alert => {
      console.log(`  ${alert.timestamp.toISOString()}: ${alert.message}`);
    });
  }
  
  // Show recent queries
  if (monitoringData.queries.length > 0) {
    console.log('\n🔍 RECENT QUERIES:');
    monitoringData.queries.slice(-10).forEach(query => {
      const duration = query.data.duration || 0;
      const status = duration > MONITOR_CONFIG.alertThreshold ? '🐌' : '⚡';
      console.log(`  ${status} ${query.message} (${duration}ms)`);
    });
  }
};

// Database connection monitoring
const monitorConnection = () => {
  const connection = mongoose.connection;
  
  connection.on('connected', () => {
    logEvent('connection', 'MongoDB connected successfully');
  });
  
  connection.on('error', (error) => {
    logEvent('connection', `MongoDB connection error: ${error.message}`, { error: error.toString() });
  });
  
  connection.on('disconnected', () => {
    logEvent('connection', 'MongoDB disconnected');
  });
  
  connection.on('reconnected', () => {
    logEvent('connection', 'MongoDB reconnected');
  });
};

// Query monitoring middleware
const setupQueryMonitoring = () => {
  // Monitor all Mongoose operations
  const originalExec = mongoose.Query.prototype.exec;
  const originalSave = mongoose.Model.prototype.save;
  const originalRemove = mongoose.Model.prototype.remove;
  const originalDeleteOne = mongoose.Model.prototype.deleteOne;
  const originalDeleteMany = mongoose.Model.prototype.deleteMany;
  const originalUpdateOne = mongoose.Model.prototype.updateOne;
  const originalUpdateMany = mongoose.Model.prototype.updateMany;
  
  // Monitor exec operations
  mongoose.Query.prototype.exec = function() {
    const startTime = Date.now();
    const query = this;
    
    return originalExec.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const operation = query.op || 'unknown';
      const collection = query.model?.collection?.name || 'unknown';
      
      logEvent('query', `${operation} on ${collection}`, {
        operation,
        collection,
        duration,
        query: query.getQuery(),
        options: query.getOptions()
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      logEvent('query', `ERROR: ${query.op || 'unknown'} on ${query.model?.collection?.name || 'unknown'}`, {
        operation: query.op || 'unknown',
        collection: query.model?.collection?.name || 'unknown',
        duration,
        error: error.message,
        query: query.getQuery()
      });
      throw error;
    });
  };
  
  // Monitor save operations
  mongoose.Model.prototype.save = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalSave.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `save on ${collection}`, {
        operation: 'save',
        collection,
        duration,
        document: model.toObject()
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: save on ${collection}`, {
        operation: 'save',
        collection,
        duration,
        error: error.message,
        document: model.toObject()
      });
      throw error;
    });
  };
  
  // Monitor remove operations
  mongoose.Model.prototype.remove = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalRemove.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `remove on ${collection}`, {
        operation: 'remove',
        collection,
        duration,
        document: model.toObject()
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: remove on ${collection}`, {
        operation: 'remove',
        collection,
        duration,
        error: error.message,
        document: model.toObject()
      });
      throw error;
    });
  };
  
  // Monitor deleteOne operations
  mongoose.Model.prototype.deleteOne = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalDeleteOne.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `deleteOne on ${collection}`, {
        operation: 'deleteOne',
        collection,
        duration,
        document: model.toObject()
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: deleteOne on ${collection}`, {
        operation: 'deleteOne',
        collection,
        duration,
        error: error.message,
        document: model.toObject()
      });
      throw error;
    });
  };
  
  // Monitor deleteMany operations
  mongoose.Model.prototype.deleteMany = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalDeleteMany.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `deleteMany on ${collection}`, {
        operation: 'deleteMany',
        collection,
        duration,
        filter: arguments[0] || {}
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: deleteMany on ${collection}`, {
        operation: 'deleteMany',
        collection,
        duration,
        error: error.message,
        filter: arguments[0] || {}
      });
      throw error;
    });
  };
  
  // Monitor updateOne operations
  mongoose.Model.prototype.updateOne = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalUpdateOne.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `updateOne on ${collection}`, {
        operation: 'updateOne',
        collection,
        duration,
        filter: arguments[0] || {},
        update: arguments[1] || {}
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: updateOne on ${collection}`, {
        operation: 'updateOne',
        collection,
        duration,
        error: error.message,
        filter: arguments[0] || {},
        update: arguments[1] || {}
      });
      throw error;
    });
  };
  
  // Monitor updateMany operations
  mongoose.Model.prototype.updateMany = function() {
    const startTime = Date.now();
    const model = this;
    
    return originalUpdateMany.apply(this, arguments).then(result => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `updateMany on ${collection}`, {
        operation: 'updateMany',
        collection,
        duration,
        filter: arguments[0] || {},
        update: arguments[1] || {}
      });
      
      return result;
    }).catch(error => {
      const duration = Date.now() - startTime;
      const collection = model.constructor.collection.name;
      
      logEvent('query', `ERROR: updateMany on ${collection}`, {
        operation: 'updateMany',
        collection,
        duration,
        error: error.message,
        filter: arguments[0] || {},
        update: arguments[1] || {}
      });
      throw error;
    });
  };
};

// Performance monitoring
const monitorPerformance = () => {
  // Monitor memory usage
  const memoryUsage = process.memoryUsage();
  logEvent('performance', 'Memory usage', {
    rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
    external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
  });
  
  // Monitor CPU usage
  const startUsage = process.cpuUsage();
  setTimeout(() => {
    const endUsage = process.cpuUsage(startUsage);
    const cpuPercent = (endUsage.user + endUsage.system) / 1000000; // Convert to seconds
    
    logEvent('performance', 'CPU usage', {
      user: endUsage.user / 1000000 + 's',
      system: endUsage.system / 1000000 + 's',
      total: cpuPercent + 's'
    });
  }, 100);
};

// Main monitoring function
const startMonitoring = async () => {
  try {
    console.log('🔍 Starting Database Monitoring...');
    console.log('==================================');
    console.log(`Check Interval: ${MONITOR_CONFIG.checkInterval}ms`);
    console.log(`Alert Threshold: ${MONITOR_CONFIG.alertThreshold}ms`);
    console.log(`Log Queries: ${MONITOR_CONFIG.logQueries}`);
    console.log(`Log Performance: ${MONITOR_CONFIG.logPerformance}`);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk');
    
    // Setup monitoring
    monitorConnection();
    setupQueryMonitoring();
    
    // Start periodic monitoring
    const monitoringInterval = setInterval(() => {
      if (MONITOR_CONFIG.logPerformance) {
        monitorPerformance();
      }
      
      // Display stats every 30 seconds
      if (Date.now() % 30000 < MONITOR_CONFIG.checkInterval) {
        displayStats();
      }
    }, MONITOR_CONFIG.checkInterval);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping monitoring...');
      clearInterval(monitoringInterval);
      
      // Save monitoring data
      const fs = await import('fs');
      const finalData = {
        ...monitoringData,
        endTime: new Date(),
        duration: Date.now() - monitoringData.startTime.getTime()
      };
      
      fs.writeFileSync('database-monitoring-log.json', JSON.stringify(finalData, null, 2));
      console.log('💾 Monitoring data saved to database-monitoring-log.json');
      
      await mongoose.disconnect();
      process.exit(0);
    });
    
    console.log('✅ Monitoring started successfully!');
    console.log('Press Ctrl+C to stop monitoring and save data.');
    
  } catch (error) {
    console.error('❌ Error starting monitoring:', error);
    process.exit(1);
  }
};

// Run monitoring if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startMonitoring();
}

export default startMonitoring; 