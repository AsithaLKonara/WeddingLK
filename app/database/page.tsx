'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Phone,
  Eye,
  Download,
  Loader2,
  Heart,
  MessageSquare,
  CreditCard,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Bell,
  Settings,
  CheckSquare,
  MessageCircle,
  Store,
  Smartphone,
  Shield,
  Star,
  Camera,
  ArrowRight,
  Mail,
  Lock,
  EyeOff,
  XCircle,
  MapPin,
  Clock,
  Play,
  Database,
  User,
  Search,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface DatabaseStatus {
  counts: {
    _users: number;
    _venues: number;
    _vendors: number;
    _bookings: number;
    _payments: number;
    _reviews: number;
    _messages: number;
    _tasks: number;
  };
  _totalRecords: number;
  _isSeeded: boolean;
  _timestamp: string;
}

export default function DatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    _text: string;
  } | null>(null);

  const fetchStatus = async () => {
    try {
      // Only fetch in browser environment
      if (typeof window === 'undefined') return;
      
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
      // Only fetch in browser environment
      if (typeof window === 'undefined') return;
      
      const response = await fetch('/api/local/seed', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', _text: 'Database seeded successfully!' });
        fetchStatus();
      } else {
        setMessage({
          type: 'error',
          _text: data.error || 'Failed to seed database',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', _text: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to reset the database? This will delete all data!'
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Only fetch in browser environment
      if (typeof window === 'undefined') return;
      
      const response = await fetch('/api/local/reset', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', _text: 'Database reset successfully!' });
        fetchStatus();
      } else {
        setMessage({
          type: 'error',
          _text: data.error || 'Failed to reset database',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', _text: 'Failed to reset database' });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    count,
    icon: Icon,
    color,
  }: {
    title: string;
    count: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Management
          </h1>
          <p className="text-gray-600">
            Manage your WeddingLK database, seed data, and monitor status.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message._text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Users"
            count={status?.counts._users || 0}
            icon={Users}
            color="text-blue-600"
          />
          <StatCard
            title="Venues"
            count={status?.counts._venues || 0}
            icon={MapPin}
            color="text-green-600"
          />
          <StatCard
            title="Vendors"
            count={status?.counts._vendors || 0}
            icon={Building2}
            color="text-purple-600"
          />
          <StatCard
            title="Bookings"
            count={status?.counts._bookings || 0}
            icon={Calendar}
            color="text-orange-600"
          />
          <StatCard
            title="Payments"
            count={status?.counts._payments || 0}
            icon={CreditCard}
            color="text-green-600"
          />
          <StatCard
            title="Reviews"
            count={status?.counts._reviews || 0}
            icon={Star}
            color="text-yellow-600"
          />
          <StatCard
            title="Messages"
            count={status?.counts._messages || 0}
            icon={MessageSquare}
            color="text-blue-600"
          />
          <StatCard
            title="Tasks"
            count={status?.counts._tasks || 0}
            icon={CheckSquare}
            color="text-indigo-600"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Database Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={seedDatabase}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Seed Database
            </button>
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reset Database
            </button>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </button>
          </div>
        </div>

        {status && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Database Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status._totalRecords}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Is Seeded</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status._isSeeded ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(status._timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}