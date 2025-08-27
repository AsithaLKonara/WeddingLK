'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Users, MapPin, Building2, Calendar, CreditCard, Star, MessageSquare, CheckSquare } from 'lucide-react';

interface DatabaseStatus {
  counts: {
    users: number;
    venues: number;
    vendors: number;
    bookings: number;
    payments: number;
    reviews: number;
    messages: number;
    tasks: number;
  };
  totalRecords: number;
  isSeeded: boolean;
  timestamp: string;
}

export default function DatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/local/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const seedDatabase = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/local/seed', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Database seeded successfully!' });
        fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to seed database' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all data!')) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/local/reset', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Database reset successfully!' });
        fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset database' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset database' });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, count, icon: Icon, color }: { title: string; count: number; icon: any; color: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {count === 0 ? 'No records' : `${count} record${count !== 1 ? 's' : ''}`}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Management</h1>
          <p className="text-muted-foreground">
            Manage your local database and sample data
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={seedDatabase} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            Seed Database
          </Button>
          <Button 
            onClick={resetDatabase} 
            disabled={loading}
            variant="destructive"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            Reset Database
          </Button>
        </div>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Users" count={status?.counts.users || 0} icon={Users} color="text-blue-600" />
        <StatCard title="Venues" count={status?.counts.venues || 0} icon={MapPin} color="text-green-600" />
        <StatCard title="Vendors" count={status?.counts.vendors || 0} icon={Building2} color="text-purple-600" />
        <StatCard title="Bookings" count={status?.counts.bookings || 0} icon={Calendar} color="text-orange-600" />
        <StatCard title="Payments" count={status?.counts.payments || 0} icon={CreditCard} color="text-emerald-600" />
        <StatCard title="Reviews" count={status?.counts.reviews || 0} icon={Star} color="text-yellow-600" />
        <StatCard title="Messages" count={status?.counts.messages || 0} icon={MessageSquare} color="text-indigo-600" />
        <StatCard title="Tasks" count={status?.counts.tasks || 0} icon={CheckSquare} color="text-red-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
          <CardDescription>
            Current status and information about your local database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Records:</span>
            <Badge variant={status?.totalRecords === 0 ? 'secondary' : 'default'}>
              {status?.totalRecords || 0}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Database Status:</span>
            <Badge variant={status?.isSeeded ? 'default' : 'secondary'}>
              {status?.isSeeded ? 'Seeded' : 'Empty'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Updated:</span>
            <span className="text-sm text-muted-foreground">
              {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Never'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available endpoints for managing your local database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Data Endpoints</h4>
              <div className="text-sm space-y-1">
                <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/local/users</code></div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/local/venues</code></div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/local/vendors</code></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Management Endpoints</h4>
              <div className="text-sm space-y-1">
                <div><code className="bg-gray-100 px-2 py-1 rounded">POST /api/local/seed</code></div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">POST /api/local/reset</code></div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/local/status</code></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

