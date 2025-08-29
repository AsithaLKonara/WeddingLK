'use client';

import React from 'react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      {showHeader && <Header />}
      <main className='flex-1'>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
