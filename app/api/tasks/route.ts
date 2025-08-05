import { NextRequest, NextResponse } from 'next/server'

// Mock tasks data storage
const tasks = [
  {
    id: 'task_1',
    title: 'Book venue',
    description: 'Research and book wedding venue',
    dueDate: '2024-02-15',
    priority: 'high',
    status: 'completed',
    category: 'venue',
    assignedTo: 'user_123',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'task_2',
    title: 'Book photographer',
    description: 'Research and book wedding photographer',
    dueDate: '2024-03-15',
    priority: 'high',
    status: 'pending',
    category: 'photography',
    assignedTo: 'user_123',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'task_3',
    title: 'Finalize guest list',
    description: 'Create final guest list for wedding',
    dueDate: '2024-04-15',
    priority: 'medium',
    status: 'in_progress',
    category: 'planning',
    assignedTo: 'user_123',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'task_4',
    title: 'Choose wedding cake',
    description: 'Select and order wedding cake',
    dueDate: '2024-05-15',
    priority: 'low',
    status: 'pending',
    category: 'catering',
    assignedTo: 'user_123',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
]

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, dueDate, priority, category } = body

    if (!title || !dueDate) {
      return NextResponse.json({
        error: 'Title and due date are required'
      }, { status: 400 })
    }

    // Create new task
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newTask = {
      id: taskId,
      title,
      description: description || '',
      dueDate,
      priority: priority || 'medium',
      status: 'pending',
      category: category || 'general',
      assignedTo: 'user_123',
      userId: 'user_123',
      createdAt: new Date().toISOString()
    }

    // Add to tasks array
    tasks.push(newTask)

    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    })

  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Task creation failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/tasks - Get tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    let filteredTasks = tasks

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }

    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === category)
    }

    const completed = filteredTasks.filter(task => task.status === 'completed').length
    const pending = filteredTasks.filter(task => task.status === 'pending').length
    const inProgress = filteredTasks.filter(task => task.status === 'in_progress').length

    return NextResponse.json({
      success: true,
      data: filteredTasks.slice(0, limit),
      total: filteredTasks.length,
      completed,
      pending,
      inProgress
    })

  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tasks',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/tasks - Update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, status, priority, title, description, dueDate } = body

    if (!taskId) {
      return NextResponse.json({
        error: 'Task ID is required'
      }, { status: 400 })
    }

    const task = tasks.find(t => t.id === taskId)
    if (!task) {
      return NextResponse.json({
        error: 'Task not found'
      }, { status: 404 })
    }

    // Update task
    if (status) task.status = status
    if (priority) task.priority = priority
    if (title) task.title = title
    if (description) task.description = description
    if (dueDate) task.dueDate = dueDate

    // Set completed date if status is completed
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    })

  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update task',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 