import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/payments - Get all payments
export async function GET(request: NextRequest) {
  try {
    const payments = await localDb.find('payments');
    return NextResponse.json({ success: true, data: payments, count: payments.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/local/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payment = await localDb.create('payments', body);
    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

