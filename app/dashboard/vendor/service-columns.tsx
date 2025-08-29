'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Service = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'per-person' | 'per-hour';
  duration?: number;
  isActive: boolean;
  images?: string[];
  features?: string[];
  createdAt: string;
};

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'name',
    header: 'Service',
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div>
          <div className='font-medium'>{service.name}</div>
          <div className='text-sm text-gray-500 line-clamp-2'>
            {service.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return (
        <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium'>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const service = row.original;
      const priceText = `LKR ${service.price.toLocaleString()}`;

      let priceTypeText = '';
      switch (service.priceType) {
        case 'per-person':
          priceTypeText = 'per person';
          break;
        case 'per-hour':
          priceTypeText = 'per hour';
          break;
        default:
          priceTypeText = 'fixed';
      }

      return (
        <div>
          <div className='font-medium'>{priceText}</div>
          <div className='text-sm text-gray-500'>{priceTypeText}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number;
      if (!duration) return <span className='text-gray-400'>-</span>;
      return (
        <div className='text-sm'>
          {duration} hour{duration !== 1 ? 's' : ''}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className='flex items-center space-x-2'>
          {service.isActive ? (
            <ToggleRight className='h-4 w-4 text-green-600' />
          ) : (
            <ToggleLeft className='h-4 w-4 text-gray-400' />
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
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
      const service = row.original;

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
              View Service
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className='mr-2 h-4 w-4' />
              Edit Service
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {service.isActive ? (
                <>
                  <ToggleLeft className='mr-2 h-4 w-4' />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className='mr-2 h-4 w-4' />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
