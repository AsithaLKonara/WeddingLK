import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DocumentVerificationService from '@/lib/verification/document-verification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Check if user is requesting their own status or is an admin
    if (userId && userId !== session.user.id && !['admin', 'maintainer'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUserId = userId || session.user.id;

    // Get verification status
    const status = await DocumentVerificationService.getVerificationStatus(targetUserId);

    // Get document types for reference
    const documentTypes = DocumentVerificationService.getDocumentTypes();

    return NextResponse.json({
      status,
      documentTypes,
      user: {
        id: targetUserId,
        role: session.user.role
      }
    });
  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 