import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/vendors - Get all vendors
export async function GET(request: NextRequest) {
  try {
    const vendors = await localDb.find('vendors');
    return NextResponse.json({
      success: true,
      data: vendors,
      count: vendors.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

// POST /api/local/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vendor = await localDb.create('vendors', body);
    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}
