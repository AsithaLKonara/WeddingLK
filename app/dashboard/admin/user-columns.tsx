'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserCheck, UserX, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
            <span className='text-sm font-medium text-gray-600'>
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className='font-medium'>{user.name}</div>
            <div className='text-sm text-gray-500'>{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleColors = {
        user: 'bg-blue-100 text-blue-800',
        vendor: 'bg-green-100 text-green-800',
        admin: 'bg-red-100 text-red-800',
        planner: 'bg-purple-100 text-purple-800',
      };

      return (
        <span
          className={
            roleColors[role as keyof typeof roleColors] ||
            'bg-gray-100 text-gray-800'
          }
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center space-x-2'>
          {user.isActive ? (
            <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center'>
              <UserCheck className='h-3 w-3 mr-1' />
              Active
            </span>
          ) : (
            <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center'>
              <UserX className='h-3 w-3 mr-1' />
              Inactive
            </span>
          )}
          {user.isVerified && (
            <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
              Verified
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className='text-sm text-gray-500'>{date.toLocaleDateString()}</div>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => {
      const lastLogin = row.getValue('lastLogin');
      if (!lastLogin) {
        return <span className='text-sm text-gray-400'>Never</span>;
      }
      const date = new Date(lastLogin as string);
      return (
        <div className='text-sm text-gray-500'>{date.toLocaleDateString()}</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='h-8 w-8 p-0 hover:bg-gray-100 rounded'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className='mr-2 h-4 w-4' />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.isActive ? (
              <DropdownMenuItem
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('userAction', {
                      detail: { userId: user._id, action: 'deactivate' },
                    })
                  )
                }
                className='text-red-600'
              >
                <UserX className='mr-2 h-4 w-4' />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('userAction', {
                      detail: { userId: user._id, action: 'activate' },
                    })
                  )
                }
                className='text-green-600'
              >
                <UserCheck className='mr-2 h-4 w-4' />
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
