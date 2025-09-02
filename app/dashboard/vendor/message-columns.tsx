'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Reply, Archive } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Message = {
  _id: string;
  _conversationId: string;
  client: {
    _name: string;
    _email: string;
    avatar?: string;
  };
  _content: string;
  messageType: 'text' | 'image' | 'file';
  direction: 'inbound' | 'outbound';
  _isRead: boolean;
  _createdAt: string;
};

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const message = row.original;
      return (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
            {message.client.avatar ? (
              <img
                src={message.client.avatar}
                alt={message.client.name}
                className='w-8 h-8 rounded-full object-cover'
              />
            ) : (
              <span className='text-sm font-medium text-gray-600'>
                {message.client.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className='font-medium'>{message.client.name}</div>
            <div className='text-sm text-gray-500'>{message.client.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'content',
    header: 'Message',
    cell: ({ row }) => {
      const message = row.original;
      const isOutbound = message.direction === 'outbound';

      return (
        <div className={`max-w-xs ${isOutbound ? 'text-right' : 'text-left'}`}>
          <div
            className={`inline-block p-2 rounded-lg ${
              isOutbound
                ? 'bg-blue-100 text-blue-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className='text-sm line-clamp-2'>
              {message.messageType === 'image' && '📷 Image'}
              {message.messageType === 'file' && '📎 File'}
              {message.messageType === 'text' && message.content}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'direction',
    header: 'Type',
    cell: ({ row }) => {
      const direction = row.getValue('direction') as string;
      const isOutbound = direction === 'outbound';

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOutbound
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isOutbound ? 'Sent' : 'Received'}
        </span>
      );
    },
  },
  {
    accessorKey: 'isRead',
    header: 'Status',
    cell: ({ row }) => {
      const message = row.original;
      const isOutbound = message.direction === 'outbound';

      if (isOutbound) {
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              message.isRead
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {message.isRead ? 'Read' : 'Delivered'}
          </span>
        );
      }

      return (
        <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
          Received
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className='text-sm text-gray-500'>{date.toLocaleDateString()}</div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const message = row.original;

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
              View Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Reply className='mr-2 h-4 w-4' />
              Reply
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className='mr-2 h-4 w-4' />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
