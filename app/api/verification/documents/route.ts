import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DocumentVerificationService from '@/lib/verification/document-verification';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentType, documentUrl, fileName, fileSize, mimeType, additionalInfo } = body;

    // Validate required fields
    if (!documentType || !documentUrl || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate document before submission
    const validation = DocumentVerificationService.validateDocument(
      documentType,
      fileSize,
      mimeType
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Document validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Submit document for verification
    const result = await DocumentVerificationService.submitVerificationDocument({
      userId: session.user.id,
      documentType,
      documentUrl,
      fileName,
      fileSize,
      mimeType,
      additionalInfo
    });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.message, details: result.rejectionReason },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error submitting verification document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Check if user is requesting their own documents or is an admin
    if (userId && userId !== session.user.id && !['admin', 'maintainer'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUserId = userId || session.user.id;

    if (['admin', 'maintainer'].includes(session.user.role || '')) {
      // Admin can get all pending verifications or specific user documents
      if (searchParams.get('pending') === 'true') {
        const pendingDocuments = await DocumentVerificationService.getPendingVerifications();
        return NextResponse.json({ documents: pendingDocuments });
      }
    }

    // Get user's documents
    const documents = await DocumentVerificationService.getUserDocuments(targetUserId);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error getting documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'maintainer'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { documentId, action, rejectionReason } = body;

    if (!documentId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Review document
    const result = await DocumentVerificationService.reviewDocument(
      documentId,
      session.user.id,
      action as 'approve' | 'reject',
      rejectionReason
    );

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error reviewing document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Delete document
    const success = await DocumentVerificationService.deleteDocument(
      documentId,
      session.user.id
    );

    if (success) {
      return NextResponse.json({ message: 'Document deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 