import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

interface BoostCampaign {
  id: string;
  packageId: string;
  packageName: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  duration: number;
  targetAudience: {
    ageRange: [number, number];
    location: string[];
    interests: string[];
    budget: [number, number];
    guestCount: [number, number];
    weddingType: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
  };
  startDate: Date;
  endDate: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');

    const db = await getDb();
    const campaignsCollection = db.collection('boost_campaigns');
    const packagesCollection = db.collection('wedding_packages');

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (vendorId) query.vendorId = vendorId;

    // Get campaigns with pagination
    const skip = (page - 1) * limit;
    const campaigns = await campaignsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Enrich campaigns with package information
    const enrichedCampaigns: BoostCampaign[] = await Promise.all(
      campaigns.map(async campaign => {
        const packageInfo = await packagesCollection.findOne(
          { _id: new ObjectId(campaign.packageId) },
          { projection: { name: 1, price: 1 } }
        );

        return {
          id: campaign._id.toString(),
          packageId: campaign.packageId,
          packageName: packageInfo?.name || 'Unknown Package',
          status: campaign.status,
          budget: campaign.budget,
          spent: campaign.spent || 0,
          duration: campaign.duration,
          targetAudience: campaign.targetAudience,
          performance: {
            impressions: campaign.performance?.impressions || 0,
            clicks: campaign.performance?.clicks || 0,
            conversions: campaign.performance?.conversions || 0,
            ctr: campaign.performance?.ctr || 0,
            cpc: campaign.performance?.cpc || 0,
            cpm: campaign.performance?.cpm || 0,
            roas: campaign.performance?.roas || 0,
          },
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        };
      })
    );

    // Get total count for pagination
    const totalCampaigns = await campaignsCollection.countDocuments(query);

    // Get performance summary
    const performanceSummary = await campaignsCollection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalBudget: { $sum: '$budget' },
            totalSpent: { $sum: '$spent' },
            totalImpressions: { $sum: '$performance.impressions' },
            totalClicks: { $sum: '$performance.clicks' },
            totalConversions: { $sum: '$performance.conversions' },
            averageCTR: { $avg: '$performance.ctr' },
            averageCPC: { $avg: '$performance.cpc' },
            averageCPM: { $avg: '$performance.cpm' },
            averageROAS: { $avg: '$performance.roas' },
          },
        },
      ])
      .toArray();

    const summary = performanceSummary[0] || {
      totalBudget: 0,
      totalSpent: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      averageCTR: 0,
      averageCPC: 0,
      averageCPM: 0,
      averageROAS: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        campaigns: enrichedCampaigns,
        pagination: {
          page,
          limit,
          total: totalCampaigns,
          totalPages: Math.ceil(totalCampaigns / limit),
        },
        summary: {
          totalBudget: summary.totalBudget,
          totalSpent: summary.totalSpent,
          totalImpressions: summary.totalImpressions,
          totalClicks: summary.totalClicks,
          totalConversions: summary.totalConversions,
          averageCTR: summary.averageCTR,
          averageCPC: summary.averageCPC,
          averageCPM: summary.averageCPM,
          averageROAS: summary.averageROAS,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching boost campaigns:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch boost campaigns',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      packageName,
      budget,
      duration,
      targetAudience,
      vendorId,
    } = body;

    if (!packageId || !packageName || !budget || !duration || !vendorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const campaignsCollection = db.collection('boost_campaigns');

    // Validate package exists
    const packageExists = await db
      .collection('wedding_packages')
      .findOne({ _id: new ObjectId(packageId) });

    if (!packageExists) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const newCampaign = {
      packageId,
      packageName,
      vendorId,
      budget: parseFloat(budget),
      spent: 0,
      duration: parseInt(duration),
      targetAudience: {
        ageRange: targetAudience.ageRange || [25, 35],
        location: targetAudience.location || [],
        interests: targetAudience.interests || [],
        budget: targetAudience.budget || [100000, 1000000],
        guestCount: targetAudience.guestCount || [50, 200],
        weddingType: targetAudience.weddingType || [],
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0,
      },
      status: 'active',
      startDate: now,
      endDate: new Date(
        now.getTime() + parseInt(duration) * 24 * 60 * 60 * 1000
      ),
      createdAt: now,
      updatedAt: now,
    };

    const result = await campaignsCollection.insertOne(newCampaign);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId.toString(),
        message: 'Boost campaign created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating boost campaign:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create boost campaign',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, action, data } = body;

    if (!campaignId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const campaignsCollection = db.collection('boost_campaigns');

    let updateData: any = { updatedAt: new Date() };

    switch (action) {
      case 'pause':
        updateData.status = 'paused';
        break;
      case 'resume':
        updateData.status = 'active';
        break;
      case 'stop':
        updateData.status = 'completed';
        break;
      case 'update':
        updateData = { ...updateData, ...data };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await campaignsCollection.updateOne(
      { _id: new ObjectId(campaignId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Campaign ${action}d successfully`,
      },
    });
  } catch (error) {
    console.error('Error updating boost campaign:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update boost campaign',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const campaignsCollection = db.collection('boost_campaigns');

    const result = await campaignsCollection.deleteOne({
      _id: new ObjectId(campaignId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Campaign deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting boost campaign:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete boost campaign',
      },
      { status: 500 }
    );
  }
}
