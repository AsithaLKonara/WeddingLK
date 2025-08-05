import { NextRequest, NextResponse } from 'next/server'

// Mock upload data storage
const uploads = [
  {
    id: 'img_1',
    url: 'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Wedding+Venue+1',
    thumbnail: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Venue+1',
    filename: 'venue_1.jpg',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'venue',
    entityId: 'venue_1',
    width: 800,
    height: 600,
    size: 1024000,
    format: 'jpeg',
    uploadedBy: 'user_123'
  },
  {
    id: 'img_2',
    url: 'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Wedding+Venue+2',
    thumbnail: 'https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Venue+2',
    filename: 'venue_2.jpg',
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    type: 'venue',
    entityId: 'venue_2',
    width: 800,
    height: 600,
    size: 1536000,
    format: 'jpeg',
    uploadedBy: 'user_123'
  },
  {
    id: 'img_3',
    url: 'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Wedding+Venue+3',
    thumbnail: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Venue+3',
    filename: 'venue_3.jpg',
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    type: 'venue',
    entityId: 'venue_3',
    width: 800,
    height: 600,
    size: 2048000,
    format: 'jpeg',
    uploadedBy: 'user_123'
  }
]

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const entityId = formData.get('entityId') as string

    if (!file || !type || !entityId) {
      return NextResponse.json({
        error: 'File, type, and entityId are required'
      }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed'
      }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File size too large. Maximum size is 5MB'
      }, { status: 400 })
    }

    // Create upload record
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newUpload = {
      id: uploadId,
      url: `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(file.name)}`,
      thumbnail: `https://via.placeholder.com/300x200/cccccc/666666?text=${encodeURIComponent(file.name)}`,
      filename: file.name,
      size: file.size,
      type: file.type,
      width: 800,
      height: 600,
      format: file.type.split('/')[1],
      uploadedAt: new Date().toISOString(),
      entityId,
      uploadType: type,
      uploadedBy: 'user_123'
    }

    // Add to uploads array
    uploads.push(newUpload)

    return NextResponse.json({
      success: true,
      data: newUpload,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/upload - Get upload status and gallery
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')
    const type = searchParams.get('type')

    if (!entityId || !type) {
      return NextResponse.json({
        error: 'EntityId and type are required'
      }, { status: 400 })
    }

    const filteredUploads = uploads.filter(upload => 
      upload.type === type && upload.entityId === entityId
    )

    return NextResponse.json({
      success: true,
      data: filteredUploads,
      total: filteredUploads.length
    })

  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load gallery',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({
        error: 'File ID is required'
      }, { status: 400 })
    }

    // Remove from uploads array
    const index = uploads.findIndex(upload => upload.id === fileId)
    if (index > -1) {
      uploads.splice(index, 1)
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Delete failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 