import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cloudinaryIntegration } from '@/lib/cloudinary-integration'
import { connectDB } from '@/lib/db'

// POST /api/upload - Upload files
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const uploadType = formData.get('type') as string
    const metadata = JSON.parse(formData.get('metadata') as string || '{}')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (!uploadType) {
      return NextResponse.json({ error: 'Upload type is required' }, { status: 400 })
    }

    await connectDB()

    let results
    switch (uploadType) {
      case 'venue_gallery':
        results = await uploadVenueGallery(files, metadata)
        break
      case 'vendor_portfolio':
        results = await uploadVendorPortfolio(files, metadata)
        break
      case 'event_photos':
        results = await uploadEventPhotos(files, metadata)
        break
      case 'profile_avatar':
        results = await uploadProfileAvatar(files[0], metadata)
        break
      case 'document':
        results = await uploadDocument(files[0], metadata)
        break
      default:
        return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: results,
      uploadType,
      filesCount: files.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'File upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/upload - Get upload status and gallery
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const galleryType = searchParams.get('type')
    const entityId = searchParams.get('entityId')
    const tags = searchParams.get('tags')

    if (!galleryType) {
      return NextResponse.json({ error: 'Gallery type is required' }, { status: 400 })
    }

    let gallery
    switch (galleryType) {
      case 'venue':
        gallery = await getVenueGallery(entityId)
        break
      case 'vendor':
        gallery = await getVendorGallery(entityId)
        break
      case 'event':
        gallery = await getEventGallery(entityId)
        break
      case 'search':
        gallery = await searchGallery(tags)
        break
      default:
        return NextResponse.json({ error: 'Invalid gallery type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      gallery,
      type: galleryType,
      entityId
    })

  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete files
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { publicIds, type } = body

    if (!publicIds || !Array.isArray(publicIds)) {
      return NextResponse.json({ error: 'Public IDs array is required' }, { status: 400 })
    }

    const deleteResults = await cloudinaryIntegration.deleteMultipleImages(publicIds)

    // Update database records if needed
    if (type === 'venue_gallery' || type === 'vendor_portfolio' || type === 'event_photos') {
      await updateGalleryRecords(publicIds, type)
    }

    return NextResponse.json({
      success: true,
      deleted: deleteResults.success,
      failed: deleteResults.failed,
      totalRequested: publicIds.length,
      totalDeleted: deleteResults.success.length
    })

  } catch (error) {
    console.error('File deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    )
  }
}

// Upload venue gallery
async function uploadVenueGallery(files: File[], metadata: any) {
  try {
    const results = await cloudinaryIntegration.uploadVenueGallery(
      metadata.venueId,
      files,
      {
        venueName: metadata.venueName,
        location: metadata.location,
        category: metadata.category || 'venue'
      }
    )

    // Update venue record with gallery images
    if (metadata.venueId) {
      const { Venue } = await import('@/lib/models/venue')
      await Venue.findByIdAndUpdate(metadata.venueId, {
        $push: { gallery: { $each: results.map(r => r.id) } }
      })
    }

    return {
      type: 'venue_gallery',
      images: results,
      venueId: metadata.venueId,
      totalUploaded: results.length
    }

  } catch (error) {
    console.error('Venue gallery upload error:', error)
    throw error
  }
}

// Upload vendor portfolio
async function uploadVendorPortfolio(files: File[], metadata: any) {
  try {
    const results = await cloudinaryIntegration.uploadVendorPortfolio(
      metadata.vendorId,
      files,
      {
        vendorName: metadata.vendorName,
        category: metadata.category,
        location: metadata.location
      }
    )

    // Update vendor record with portfolio images
    if (metadata.vendorId) {
      const { Vendor } = await import('@/lib/models/vendor')
      await Vendor.findByIdAndUpdate(metadata.vendorId, {
        $push: { portfolio: { $each: results.map(r => r.id) } }
      })
    }

    return {
      type: 'vendor_portfolio',
      images: results,
      vendorId: metadata.vendorId,
      totalUploaded: results.length
    }

  } catch (error) {
    console.error('Vendor portfolio upload error:', error)
    throw error
  }
}

// Upload event photos
async function uploadEventPhotos(files: File[], metadata: any) {
  try {
    const results = await cloudinaryIntegration.uploadEventPhotos(
      metadata.eventId,
      files,
      {
        eventName: metadata.eventName,
        date: metadata.date,
        location: metadata.location,
        photographer: metadata.photographer
      }
    )

    // Update event record with photos
    if (metadata.eventId) {
      const { Booking } = await import('@/lib/models/booking')
      await Booking.findByIdAndUpdate(metadata.eventId, {
        $push: { photos: { $each: results.map(r => r.id) } }
      })
    }

    return {
      type: 'event_photos',
      images: results,
      eventId: metadata.eventId,
      totalUploaded: results.length
    }

  } catch (error) {
    console.error('Event photos upload error:', error)
    throw error
  }
}

// Upload profile avatar
async function uploadProfileAvatar(file: File, metadata: any) {
  try {
    const result = await cloudinaryIntegration.uploadImage(file, {
      folder: `profiles/${metadata.userId}`,
      transformation: cloudinaryIntegration.getTransformationPresets().profile_avatar,
      tags: ['profile', 'avatar'],
      context: {
        user_id: metadata.userId,
        user_name: metadata.userName
      }
    })

    // Update user profile
    if (metadata.userId) {
      const { User } = await import('@/lib/models/user')
      await User.findByIdAndUpdate(metadata.userId, {
        avatar: result.secureUrl
      })
    }

    return {
      type: 'profile_avatar',
      image: result,
      userId: metadata.userId
    }

  } catch (error) {
    console.error('Profile avatar upload error:', error)
    throw error
  }
}

// Upload document
async function uploadDocument(file: File, metadata: any) {
  try {
    const result = await cloudinaryIntegration.uploadImage(file, {
      folder: `documents/${metadata.category || 'general'}`,
      tags: ['document', metadata.category || 'general'],
      context: {
        document_type: metadata.documentType,
        uploaded_by: metadata.userId,
        category: metadata.category
      }
    })

    return {
      type: 'document',
      document: result,
      category: metadata.category,
      documentType: metadata.documentType
    }

  } catch (error) {
    console.error('Document upload error:', error)
    throw error
  }
}

// Get venue gallery
async function getVenueGallery(venueId: string | null) {
  if (!venueId) return []

  try {
    const { Venue } = await import('@/lib/models/venue')
    const venue = await Venue.findById(venueId).select('gallery').lean()
    
    if (!venue || !(venue as any).gallery) return []

    const galleryItems = await Promise.all(
      ((venue as any).gallery as string[]).map(async (imageId: string) => {
        try {
          const imageInfo = await cloudinaryIntegration.getImageInfo(imageId)
          return {
            id: imageId,
            url: imageInfo.secure_url,
            thumbnail: cloudinaryIntegration.generateThumbnailUrl(imageId),
            title: imageInfo.context?.title || imageId,
            description: imageInfo.context?.description,
            uploadedAt: new Date(imageInfo.created_at)
          }
        } catch (error) {
          console.error(`Error fetching image info for ${imageId}:`, error)
          return null
        }
      })
    )

    return galleryItems.filter(item => item !== null)

  } catch (error) {
    console.error('Venue gallery fetch error:', error)
    return []
  }
}

// Get vendor gallery
async function getVendorGallery(vendorId: string | null) {
  if (!vendorId) return []

  try {
    const { Vendor } = await import('@/lib/models/vendor')
    const vendor = await Vendor.findById(vendorId).select('portfolio').lean()
    
    if (!vendor || !(vendor as any).portfolio) return []

    const galleryItems = await Promise.all(
      ((vendor as any).portfolio as string[]).map(async (imageId: string) => {
        try {
          const imageInfo = await cloudinaryIntegration.getImageInfo(imageId)
          return {
            id: imageId,
            url: imageInfo.secure_url,
            thumbnail: cloudinaryIntegration.generateThumbnailUrl(imageId),
            title: imageInfo.context?.title || imageId,
            description: imageInfo.context?.description,
            uploadedAt: new Date(imageInfo.created_at)
          }
        } catch (error) {
          console.error(`Error fetching image info for ${imageId}:`, error)
          return null
        }
      })
    )

    return galleryItems.filter(item => item !== null)

  } catch (error) {
    console.error('Vendor gallery fetch error:', error)
    return []
  }
}

// Get event gallery
async function getEventGallery(eventId: string | null) {
  if (!eventId) return []

  try {
    const { Booking } = await import('@/lib/models/booking')
    const booking = await Booking.findById(eventId).select('photos').lean()
    
    if (!booking || !(booking as any).photos) return []

    const galleryItems = await Promise.all(
      ((booking as any).photos as string[]).map(async (imageId: string) => {
        try {
          const imageInfo = await cloudinaryIntegration.getImageInfo(imageId)
          return {
            id: imageId,
            url: imageInfo.secure_url,
            thumbnail: cloudinaryIntegration.generateThumbnailUrl(imageId),
            title: imageInfo.context?.title || imageId,
            description: imageInfo.context?.description,
            uploadedAt: new Date(imageInfo.created_at)
          }
        } catch (error) {
          console.error(`Error fetching image info for ${imageId}:`, error)
          return null
        }
      })
    )

    return galleryItems.filter(item => item !== null)

  } catch (error) {
    console.error('Event gallery fetch error:', error)
    return []
  }
}

// Search gallery by tags
async function searchGallery(tags: string | null) {
  if (!tags) return []

  try {
    const tagArray = tags.split(',').map(tag => tag.trim())
    const results = await cloudinaryIntegration.searchImagesByTags(tagArray, {
      maxResults: 50
    })

    return results

  } catch (error) {
    console.error('Gallery search error:', error)
    return []
  }
}

// Update gallery records after deletion
async function updateGalleryRecords(publicIds: string[], type: string) {
  try {
    const { Venue } = await import('@/lib/models/venue')
    const { Vendor } = await import('@/lib/models/vendor')
    const { Booking } = await import('@/lib/models/booking')

    switch (type) {
      case 'venue_gallery':
        await Venue.updateMany(
          { gallery: { $in: publicIds } },
          { $pull: { gallery: { $in: publicIds } } }
        )
        break
      case 'vendor_portfolio':
        await Vendor.updateMany(
          { portfolio: { $in: publicIds } },
          { $pull: { portfolio: { $in: publicIds } } }
        )
        break
      case 'event_photos':
        await Booking.updateMany(
          { photos: { $in: publicIds } },
          { $pull: { photos: { $in: publicIds } } }
        )
        break
    }

  } catch (error) {
    console.error('Gallery records update error:', error)
  }
} 