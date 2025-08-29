import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth-config';
import { Task } from '@/lib/models/task';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const tasks = await Task.find({ plannerId: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const { task, date, clientId } = body;
    if (!task || !date)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    const newTask = await Task.create({
      plannerId: session.user.id,
      task,
      date,
      clientId,
    });
    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const { id, ...update } = body;
    if (!id)
      return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    const task = await Task.findOneAndUpdate(
      { _id: id, plannerId: session.user.id },
      update,
      { new: true }
    );
    if (!task)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const { id } = body;
    if (!id)
      return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    const result = await Task.deleteOne({
      _id: id,
      plannerId: session.user.id,
    });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
