'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Booking = {
  _id: string;
  client: {
    _name: string;
    _email: string;
    _phone: string;
  };
  venue?: {
    _name: string;
    _location: string;
  };
  _date: string;
  startTime?: string;
  endTime?: string;
  _totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  _createdAt: string;
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className='font-medium'>{booking.client.name}</div>
          <div className='text-sm text-gray-500'>{booking.client.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'venue',
    header: 'Venue',
    cell: ({ row }) => {
      const booking = row.original;
      if (!booking.venue) return <span className='text-gray-400'>-</span>;
      return (
        <div>
          <div className='font-medium'>{booking.venue.name}</div>
          <div className='text-sm text-gray-500'>{booking.venue.location}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date & Time',
    cell: ({ row }) => {
      const booking = row.original;
      const date = new Date(booking.date);
      const dateText = date.toLocaleDateString();

      let timeText = '';
      if (booking.startTime && booking.endTime) {
        timeText = `${booking.startTime} - ${booking.endTime}`;
      } else if (booking.startTime) {
        timeText = booking.startTime;
      }

      return (
        <div>
          <div className='font-medium'>{dateText}</div>
          {timeText && <div className='text-sm text-gray-500'>{timeText}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number;
      return <div className='font-medium'>LKR {amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const getStatusColor = (_status: string) => {
        switch (status) {
          case 'confirmed':
            return 'bg-green-100 text-green-800';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800';
          case 'completed':
            return 'bg-blue-100 text-blue-800';
          case 'cancelled':
          case 'rejected':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      const getStatusIcon = (_status: string) => {
        switch (status) {
          case 'confirmed':
            return <CheckCircle className='h-4 w-4 text-green-600' />;
          case 'pending':
            return <Clock className='h-4 w-4 text-yellow-600' />;
          case 'completed':
            return <CheckCircle className='h-4 w-4 text-blue-600' />;
          case 'cancelled':
          case 'rejected':
            return <XCircle className='h-4 w-4 text-red-600' />;
          default:
            return null;
        }
      };

      return (
        <div className='flex items-center space-x-2'>
          {getStatusIcon(status)}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className='mr-2 h-4 w-4' />
              Confirm Booking
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XCircle className='mr-2 h-4 w-4' />
              Reject Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
