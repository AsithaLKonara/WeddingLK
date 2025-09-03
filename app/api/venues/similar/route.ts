import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/venue';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venueId');
    const location = searchParams.get('location');
    const price = searchParams.get('price');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!venueId) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      );
    }

    // Get the current venue to find similar ones
    const currentVenue = await (Venue as any).findById(venueId);
    if (!currentVenue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Build similarity query
    const query: any = {
      _id: { $ne: venueId }, // Exclude current venue
      isActive: true,
    };

    // Find venues in similar location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Find venues in similar price range (±20%)
    if (price) {
      const priceNum = parseInt(price);
      const priceRange = priceNum * 0.2;
      query.price = {
        $gte: priceNum - priceRange,
        $lte: priceNum + priceRange,
      };
    }

    // Find venues with similar capacity (±25%)
    if (currentVenue.capacity) {
      const capacityRange = currentVenue.capacity * 0.25;
      query.capacity = {
        $gte: currentVenue.capacity - capacityRange,
        $lte: currentVenue.capacity + capacityRange,
      };
    }

    // Fetch similar venues
    const similarVenues = await (Venue as any).find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedVenues = similarVenues.map((venue: any) => ({
      _id: venue._id,
      _name: venue.name,
      _location: venue.location,
      _capacity: venue.capacity,
      _price: venue.price,
      _rating: venue.rating || 0,
      _image: venue.images?.[0] || '/placeholder.svg',
      _amenities: venue.amenities || [],
      distance: 0, // Calculate if needed
      similarity: 0.8, // Calculate based on matching criteria
    }));

    return NextResponse.json({
      venues: transformedVenues,
      total: transformedVenues.length,
    });
  } catch (error) {
    console.error('Error fetching similar venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar venues' },
      { status: 500 }
    );
  }
}
