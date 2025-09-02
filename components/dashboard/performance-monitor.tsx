import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Database,
  Globe,
  HardDrive,
  Cpu,
  Network,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface PerformanceMetrics {
  _timestamp: number;
  cpu: {
    _usage: number;
    _load: number;
    _temperature: number;
  };
  memory: {
    _used: number;
    _total: number;
    _percentage: number;
  };
  database: {
    _connections: number;
    _queries: number;
    _responseTime: number;
    _cacheHitRate: number;
  };
  network: {
    _requests: number;
    _responseTime: number;
    _errorRate: number;
    _throughput: number;
  };
  frontend: {
    _bundleSize: number;
    _loadTime: number;
    _renderTime: number;
    _lighthouseScore: number;
  };
  redis: {
    _memory: number;
    _keys: number;
    _hitRate: number;
    _connections: number;
  };
}

interface Alert {
  _id: string;
  type: 'warning' | 'error' | 'info';
  _message: string;
  _timestamp: number;
  _resolved: boolean;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const fetchMetrics = useCallback(async () => {
    try {
      // In a real implementation, this would fetch from your monitoring endpoints
      const mockMetrics: PerformanceMetrics = {
        timestamp: Date.now(),
        cpu: {
          usage: Math.random() * 100,
          load: Math.random() * 10,
          temperature: 45 + Math.random() * 20,
        },
        memory: {
          used: 4.2 + Math.random() * 2,
          total: 8,
          percentage: ((4.2 + Math.random() * 2) / 8) * 100,
        },
        database: {
          connections: 15 + Math.floor(Math.random() * 10),
          queries: 1000 + Math.floor(Math.random() * 500),
          responseTime: 50 + Math.random() * 100,
          cacheHitRate: 85 + Math.random() * 15,
        },
        network: {
          requests: 500 + Math.floor(Math.random() * 200),
          responseTime: 100 + Math.random() * 200,
          errorRate: Math.random() * 2,
          throughput: 10 + Math.random() * 5,
        },
        frontend: {
          bundleSize: 2.1 + Math.random() * 0.5,
          loadTime: 800 + Math.random() * 400,
          renderTime: 200 + Math.random() * 300,
          lighthouseScore: 85 + Math.random() * 15,
        },
        redis: {
          memory: 128 + Math.random() * 64,
          keys: 10000 + Math.floor(Math.random() * 5000),
          hitRate: 90 + Math.random() * 10,
          connections: 5 + Math.floor(Math.random() * 5),
        },
      };

      setMetrics(mockMetrics);
      checkAlerts(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, refreshInterval, fetchMetrics]);

  const checkAlerts = (metrics: PerformanceMetrics) => {
    const newAlerts: Alert[] = [];

    // CPU alerts
    if (metrics.cpu.usage > 80) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: 'warning',
        message: `High CPU usage: ${metrics.cpu.usage.toFixed(1)}%`,
        timestamp: Date.now(),
        resolved: false,
      });
    }

    // Memory alerts
    if (metrics.memory.percentage > 85) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: 'warning',
        message: `High memory usage: ${metrics.memory.percentage.toFixed(1)}%`,
        timestamp: Date.now(),
        resolved: false,
      });
    }

    // Database alerts
    if (metrics.database.responseTime > 200) {
      newAlerts.push({
        id: `db-${Date.now()}`,
        type: 'warning',
        message: `Slow database response: ${metrics.database.responseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        resolved: false,
      });
    }

    // Network alerts
    if (metrics.network.errorRate > 1) {
      newAlerts.push({
        id: `network-${Date.now()}`,
        type: 'error',
        message: `High error rate: ${metrics.network.errorRate.toFixed(2)}%`,
        timestamp: Date.now(),
        resolved: false,
      });
    }

    setAlerts(prev => [...prev, ...newAlerts]);
  };

  const getStatusColor = (
    _value: number,
    thresholds: { _warning: number; error: number }
  ) => {
    if (value >= thresholds.error) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (
    _value: number,
    thresholds: { _warning: number; error: number }
  ) => {
    if (value >= thresholds.error)
      return <AlertTriangle className='h-4 w-4 text-red-500' />;
    if (value >= thresholds.warning)
      return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
    return <CheckCircle className='h-4 w-4 text-green-500' />;
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    fetchMetrics();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const resolveAlert = (_alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  if (!metrics) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Button onClick={startMonitoring} className='flex items-center gap-2'>
          <Activity className='h-4 w-4' />
          Start Performance Monitoring
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            Performance Monitor
          </h2>
          <p className='text-muted-foreground'>
            Real-time system performance metrics and alerts
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Badge variant={isMonitoring ? 'default' : 'secondary'}>
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </Badge>
            <span className='text-sm text-muted-foreground'>
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <Button
            variant={isMonitoring ? 'destructive' : 'default'}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className='flex items-center gap-2'
          >
            {isMonitoring ? (
              <>
                <Activity className='h-4 w-4' />
                Stop Monitoring
              </>
            ) : (
              <>
                <Activity className='h-4 w-4' />
                Start Monitoring
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.resolved).length > 0 && (
        <Card className='border-red-200 bg-red-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-red-800'>
              <AlertTriangle className='h-5 w-5' />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {alerts
                .filter(alert => !alert.resolved)
                .slice(0, 5)
                .map(alert => (
                  <div
                    key={alert.id}
                    className='flex items-center justify-between p-2 bg-white rounded border'
                  >
                    <span className='text-sm text-red-700'>
                      {alert.message}
                    </span>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Tabs */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='system'>System</TabsTrigger>
          <TabsTrigger value='database'>Database</TabsTrigger>
          <TabsTrigger value='network'>Network</TabsTrigger>
          <TabsTrigger value='frontend'>Frontend</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* CPU Usage */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>CPU Usage</CardTitle>
                {getStatusIcon(metrics.cpu.usage, { warning: 70, error: 90 })}
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics.cpu.usage.toFixed(1)}%
                </div>
                <Progress value={metrics.cpu.usage} className='mt-2' />
                <p className='text-xs text-muted-foreground mt-2'>
                  Load: {metrics.cpu.load.toFixed(2)} | Temp:{' '}
                  {metrics.cpu.temperature.toFixed(1)}°C
                </p>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Memory Usage
                </CardTitle>
                {getStatusIcon(metrics.memory.percentage, {
                  warning: 80,
                  error: 90,
                })}
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics.memory.percentage.toFixed(1)}%
                </div>
                <Progress value={metrics.memory.percentage} className='mt-2' />
                <p className='text-xs text-muted-foreground mt-2'>
                  {metrics.memory.used.toFixed(1)}GB / {metrics.memory.total}GB
                </p>
              </CardContent>
            </Card>

            {/* Database Performance */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Database</CardTitle>
                {getStatusIcon(metrics.database.responseTime, {
                  warning: 150,
                  error: 300,
                })}
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics.database.responseTime.toFixed(0)}ms
                </div>
                <p className='text-xs text-muted-foreground mt-2'>
                  Connections: {metrics.database.connections} | Cache:{' '}
                  {metrics.database.cacheHitRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            {/* Network Performance */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Network</CardTitle>
                {getStatusIcon(metrics.network.errorRate, {
                  warning: 0.5,
                  error: 1.0,
                })}
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics.network.errorRate.toFixed(2)}%
                </div>
                <p className='text-xs text-muted-foreground mt-2'>
                  {metrics.network.requests}/min |{' '}
                  {metrics.network.throughput.toFixed(1)} MB/s
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='system' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Server className='h-5 w-5' />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>CPU Load</span>
                    <span>{metrics.cpu.load.toFixed(2)}</span>
                  </div>
                  <Progress value={(metrics.cpu.load / 10) * 100} />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Temperature</span>
                    <span>{metrics.cpu.temperature.toFixed(1)}°C</span>
                  </div>
                  <Progress value={(metrics.cpu.temperature / 100) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Cpu className='h-5 w-5' />
                  Memory Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Used</span>
                    <span className='font-mono'>
                      {metrics.memory.used.toFixed(1)} GB
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Available</span>
                    <span className='font-mono'>
                      {(metrics.memory.total - metrics.memory.used).toFixed(1)}{' '}
                      GB
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Total</span>
                    <span className='font-mono'>{metrics.memory.total} GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='database' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Database className='h-5 w-5' />
                  Database Performance
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Response Time</span>
                    <span>{metrics.database.responseTime.toFixed(0)}ms</span>
                  </div>
                  <Progress
                    value={Math.min(
                      (metrics.database.responseTime / 500) * 100,
                      100
                    )}
                    className={getStatusColor(metrics.database.responseTime, {
                      warning: 150,
                      error: 300,
                    })}
                  />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Cache Hit Rate</span>
                    <span>{metrics.database.cacheHitRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.database.cacheHitRate} />
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Connections</span>
                    <div className='font-mono'>
                      {metrics.database.connections}
                    </div>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Queries/min</span>
                    <div className='font-mono'>{metrics.database.queries}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <HardDrive className='h-5 w-5' />
                  Redis Cache
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Memory Usage</span>
                    <span>{metrics.redis.memory.toFixed(0)} MB</span>
                  </div>
                  <Progress value={(metrics.redis.memory / 256) * 100} />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Hit Rate</span>
                    <span>{metrics.redis.hitRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.redis.hitRate} />
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Keys</span>
                    <div className='font-mono'>
                      {metrics.redis.keys.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Connections</span>
                    <div className='font-mono'>{metrics.redis.connections}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='network' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Network className='h-5 w-5' />
                  Network Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Error Rate</span>
                    <span>{metrics.network.errorRate.toFixed(2)}%</span>
                  </div>
                  <Progress
                    value={Math.min((metrics.network.errorRate / 2) * 100, 100)}
                    className={getStatusColor(metrics.network.errorRate, {
                      warning: 0.5,
                      error: 1.0,
                    })}
                  />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Response Time</span>
                    <span>{metrics.network.responseTime.toFixed(0)}ms</span>
                  </div>
                  <Progress
                    value={(metrics.network.responseTime / 500) * 100}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Requests/min</span>
                    <div className='font-mono'>{metrics.network.requests}</div>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Throughput</span>
                    <div className='font-mono'>
                      {metrics.network.throughput.toFixed(1)} MB/s
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Globe className='h-5 w-5' />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Health Check</span>
                    <Badge
                      variant='default'
                      className='bg-green-100 text-green-800'
                    >
                      Healthy
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Uptime</span>
                    <span className='font-mono'>99.9%</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Last Incident</span>
                    <span className='text-muted-foreground'>None</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='frontend' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5' />
                  Frontend Performance
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Bundle Size</span>
                    <span>{metrics.frontend.bundleSize.toFixed(1)} MB</span>
                  </div>
                  <Progress value={(metrics.frontend.bundleSize / 3) * 100} />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Load Time</span>
                    <span>{metrics.frontend.loadTime.toFixed(0)}ms</span>
                  </div>
                  <Progress
                    value={Math.min(
                      (metrics.frontend.loadTime / 1000) * 100,
                      100
                    )}
                    className={getStatusColor(metrics.frontend.loadTime, {
                      warning: 800,
                      error: 1500,
                    })}
                  />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span>Render Time</span>
                    <span>{metrics.frontend.renderTime.toFixed(0)}ms</span>
                  </div>
                  <Progress value={(metrics.frontend.renderTime / 500) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Lighthouse Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <div className='text-4xl font-bold mb-2'>
                    {metrics.frontend.lighthouseScore.toFixed(0)}
                  </div>
                  <div className='text-sm text-muted-foreground mb-4'>
                    out of 100
                  </div>
                  <Progress
                    value={metrics.frontend.lighthouseScore}
                    className='mb-4'
                  />
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Performance</span>
                      <div className='font-mono'>92</div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>
                        Accessibility
                      </span>
                      <div className='font-mono'>95</div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>
                        Best Practices
                      </span>
                      <div className='font-mono'>88</div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>SEO</span>
                      <div className='font-mono'>90</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitor;
