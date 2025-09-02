'use client';

import React from 'react';
import { DashboardNavigation } from '@/components/organisms/dashboard-navigation';
import { DashboardHeader } from '@/components/organisms/dashboard-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

export function DashboardLayout({ 
  children, 
  userRole = 'user' 
}: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <DashboardHeader />
      <div className='flex'>
        <DashboardNavigation userRole={userRole} />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}