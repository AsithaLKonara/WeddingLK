interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

interface PerformanceData {
  timestamp: Date;
  metrics: PerformanceMetrics;
  context: string;
  userId?: string;
  sessionId?: string;
}

interface PerformanceThresholds {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseQueryTime: number;
  errorRate: number;
}

interface PerformanceAlert {
  type: 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceData[]> = new Map();
  private thresholds: PerformanceThresholds = {
    responseTime: 1000, // 1 second
    memoryUsage: 80, // 80%
    cpuUsage: 90, // 90%
    databaseQueryTime: 500, // 500ms
    errorRate: 5 // 5%
  };
  private alerts: PerformanceAlert[] = [];

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track API performance
  public static async trackAPIPerformance(context: string, operation: () => Promise<unknown>): Promise<unknown> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const endCpu = process.cpuUsage();

      const metrics: PerformanceMetrics = {
        responseTime: endTime - startTime,
        memoryUsage: (endMemory.heapUsed / endMemory.heapTotal) * 100,
        cpuUsage: ((endCpu.user + endCpu.system) / 1000000), // Convert to seconds
        databaseQueryTime: 0, // Will be updated by database operations
        cacheHitRate: 0, // Will be updated by cache operations
        errorRate: 0,
        throughput: 1
      };

      const performanceData: PerformanceData = {
        timestamp: new Date(),
        metrics,
        context
      };

      // Store performance data
      await PerformanceMonitor.storePerformanceData(performanceData);

      // Check thresholds and generate alerts
      PerformanceMonitor.checkThresholds(metrics, context);

      return result;

    } catch (error) {
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const endCpu = process.cpuUsage();

      const metrics: PerformanceMetrics = {
        responseTime: endTime - startTime,
        memoryUsage: (endMemory.heapUsed / endMemory.heapTotal) * 100,
        cpuUsage: ((endCpu.user + endCpu.system) / 1000000),
        databaseQueryTime: 0,
        cacheHitRate: 0,
        errorRate: 100,
        throughput: 1
      };

      const performanceData: PerformanceData = {
        timestamp: new Date(),
        metrics,
        context
      };

      await PerformanceMonitor.storePerformanceData(performanceData);
      PerformanceMonitor.checkThresholds(metrics, context);

      throw error;
    }
  }

  // Track database performance
  public static async trackDatabasePerformance(operation: string, query: string, operationFn: () => Promise<unknown>): Promise<unknown> {
    const startTime = Date.now();

    try {
      const result = await operationFn();
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      // Update database query time in recent performance data
      const instance = PerformanceMonitor.getInstance();
      const recentData = instance.metrics.get('database') || [];
      if (recentData.length > 0) {
        const latest = recentData[recentData.length - 1];
        latest.metrics.databaseQueryTime = queryTime;
      }

      return result;

    } catch (error) {
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      console.error(`Database operation failed: ${operation}`, {
        query,
        queryTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  // Track cache performance
  public static trackCachePerformance(hit: boolean): void {
    const instance = PerformanceMonitor.getInstance();
    const recentData = instance.metrics.get('cache') || [];
    
    if (recentData.length > 0) {
      const latest = recentData[recentData.length - 1];
      latest.metrics.cacheHitRate = hit ? 100 : 0;
    }
  }

  // Store performance data
  private static async storePerformanceData(data: PerformanceData): Promise<void> {
    try {
      // Store in memory for quick access
      const instance = PerformanceMonitor.getInstance();
      const contextData = instance.metrics.get(data.context) || [];
      contextData.push(data);
      
      // Keep only last 100 entries per context
      if (contextData.length > 100) {
        contextData.splice(0, contextData.length - 100);
      }
      
      instance.metrics.set(data.context, contextData);

    } catch (error) {
      console.error('Error storing performance data:', error);
    }
  }

  // Check performance thresholds
  private static checkThresholds(metrics: PerformanceMetrics, context: string): void {
    const instance = PerformanceMonitor.getInstance();
    const alerts: PerformanceAlert[] = [];

    if (metrics.responseTime > instance.thresholds.responseTime) {
      alerts.push({
        type: metrics.responseTime > instance.thresholds.responseTime * 2 ? 'critical' : 'warning',
        metric: 'responseTime',
        value: metrics.responseTime,
        threshold: instance.thresholds.responseTime,
        message: `Response time ${metrics.responseTime}ms exceeds threshold ${instance.thresholds.responseTime}ms in ${context}`,
        timestamp: new Date()
      });
    }

    if (metrics.memoryUsage > instance.thresholds.memoryUsage) {
      alerts.push({
        type: metrics.memoryUsage > instance.thresholds.memoryUsage * 1.2 ? 'critical' : 'warning',
        metric: 'memoryUsage',
        value: metrics.memoryUsage,
        threshold: instance.thresholds.memoryUsage,
        message: `Memory usage ${metrics.memoryUsage.toFixed(2)}% exceeds threshold ${instance.thresholds.memoryUsage}% in ${context}`,
        timestamp: new Date()
      });
    }

    if (metrics.cpuUsage > instance.thresholds.cpuUsage) {
      alerts.push({
        type: metrics.cpuUsage > instance.thresholds.cpuUsage * 1.1 ? 'critical' : 'warning',
        metric: 'cpuUsage',
        value: metrics.cpuUsage,
        threshold: instance.thresholds.cpuUsage,
        message: `CPU usage ${metrics.cpuUsage.toFixed(2)}s exceeds threshold ${instance.thresholds.cpuUsage}s in ${context}`,
        timestamp: new Date()
      });
    }

    if (metrics.databaseQueryTime > instance.thresholds.databaseQueryTime) {
      alerts.push({
        type: metrics.databaseQueryTime > instance.thresholds.databaseQueryTime * 2 ? 'critical' : 'warning',
        metric: 'databaseQueryTime',
        value: metrics.databaseQueryTime,
        threshold: instance.thresholds.databaseQueryTime,
        message: `Database query time ${metrics.databaseQueryTime}ms exceeds threshold ${instance.thresholds.databaseQueryTime}ms in ${context}`,
        timestamp: new Date()
      });
    }

    if (metrics.errorRate > instance.thresholds.errorRate) {
      alerts.push({
        type: metrics.errorRate > instance.thresholds.errorRate * 2 ? 'critical' : 'warning',
        metric: 'errorRate',
        value: metrics.errorRate,
        threshold: instance.thresholds.errorRate,
        message: `Error rate ${metrics.errorRate}% exceeds threshold ${instance.thresholds.errorRate}% in ${context}`,
        timestamp: new Date()
      });
    }

    // Add alerts to the list
    instance.alerts.push(...alerts);

    // Keep only last 100 alerts
    if (instance.alerts.length > 100) {
      instance.alerts = instance.alerts.slice(-100);
    }

    // Log critical alerts
    alerts.filter(alert => alert.type === 'critical').forEach(alert => {
      console.error('CRITICAL PERFORMANCE ALERT:', alert.message);
    });
  }

  // Get performance analytics
  public static async getPerformanceAnalytics(timeRange: '1h' | '24h' | '7d'): Promise<Record<string, unknown>> {
    try {
      const instance = PerformanceMonitor.getInstance();
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '1h':
          startDate = new Date();
          startDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          startDate = new Date();
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate = new Date();
          startDate.setDate(now.getDate() - 7);
          break;
        default:
          startDate = new Date();
      }

      // Get performance data from memory
      const allData = Array.from(instance.metrics.values()).flat();
      const performanceData = allData.filter(data => 
        data.timestamp >= startDate && data.timestamp <= now
      );

      if (performanceData.length === 0) {
      return {
          success: true,
          timeRange,
          message: 'No performance data available for the specified time range',
          data: {
            averageResponseTime: 0,
            averageMemoryUsage: 0,
            averageCpuUsage: 0,
            averageDatabaseQueryTime: 0,
            totalErrors: 0,
            totalRequests: 0
          }
        };
      }

      // Calculate averages
      const totalMetrics = performanceData.reduce((acc: Record<string, number>, data: PerformanceData) => {
        acc.responseTime += data.metrics.responseTime;
        acc.memoryUsage += data.metrics.memoryUsage;
        acc.cpuUsage += data.metrics.cpuUsage;
        acc.databaseQueryTime += data.metrics.databaseQueryTime;
        acc.errors += data.metrics.errorRate > 0 ? 1 : 0;
        return acc;
      }, {
        responseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        databaseQueryTime: 0,
        errors: 0
      });

      const count = performanceData.length;
      const analytics = {
        timeRange,
        totalRequests: count,
        averageResponseTime: Math.round(totalMetrics.responseTime / count),
        averageMemoryUsage: Math.round((totalMetrics.memoryUsage / count) * 100) / 100,
        averageCpuUsage: Math.round((totalMetrics.cpuUsage / count) * 100) / 100,
        averageDatabaseQueryTime: Math.round(totalMetrics.databaseQueryTime / count),
        totalErrors: totalMetrics.errors,
        errorRate: Math.round((totalMetrics.errors / count) * 100),
        performanceTrend: this.calculatePerformanceTrend(performanceData)
      };

      return {
        success: true,
        data: analytics
      };

    } catch (error) {
      console.error('Error getting performance analytics:', error);
      return {
        success: false,
        error: 'Failed to get performance analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Calculate performance trend
  private static calculatePerformanceTrend(data: PerformanceData[]): string {
    if (data.length < 2) return 'insufficient_data';

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg = firstHalf.reduce((sum, item) => sum + item.metrics.responseTime, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.metrics.responseTime, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change < -10) return 'improving';
    if (change > 10) return 'degrading';
    return 'stable';
  }

  // Get performance alerts
  public static getPerformanceAlerts(): PerformanceAlert[] {
    return PerformanceMonitor.getInstance().alerts;
  }

  // Update performance thresholds
  public static updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    const instance = PerformanceMonitor.getInstance();
    instance.thresholds = { ...instance.thresholds, ...newThresholds };
  }

  // Get current performance metrics
  public static getCurrentMetrics(): PerformanceMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      responseTime: 0,
      memoryUsage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000,
      databaseQueryTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      throughput: 0
    };
  }

  // Clear old performance data
  public static async clearOldData(daysToKeep: number = 30): Promise<void> {
    try {
      const instance = PerformanceMonitor.getInstance();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Clear old data from memory
      Array.from(instance.metrics.entries()).forEach(([context, data]) => {
        const filteredData = data.filter(item => item.timestamp >= cutoffDate);
        instance.metrics.set(context, filteredData);
      });

      console.log(`Cleared performance data older than ${daysToKeep} days`);

    } catch (error) {
      console.error('Error clearing old performance data:', error);
    }
  }
}

export default PerformanceMonitor; 