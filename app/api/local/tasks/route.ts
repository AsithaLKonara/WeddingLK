import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const tasks = await localDb.find('tasks');
    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/local/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await localDb.create('tasks', body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
