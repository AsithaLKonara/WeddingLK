import { Document, User, VendorProfile, WeddingPlannerProfile } from '@/lib/models';
import { sendEmail } from '@/lib/email';

export interface VerificationRequest {
  userId: string;
  documentType: string;
  documentUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  additionalInfo?: Record<string, any>;
}

export interface VerificationResult {
  success: boolean;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  validationRules: string[];
}

export class DocumentVerificationService {
  private static instance: DocumentVerificationService;

  static getInstance(): DocumentVerificationService {
    if (!DocumentVerificationService.instance) {
      DocumentVerificationService.instance = new DocumentVerificationService();
    }
    return DocumentVerificationService.instance;
  }

  // Document type definitions
  private documentTypes: DocumentType[] = [
    {
      id: 'business_license',
      name: 'Business License',
      description: 'Official business license or permit',
      required: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      validationRules: ['Must be current and valid', 'Must show business name and address']
    },
    {
      id: 'insurance_certificate',
      name: 'Insurance Certificate',
      description: 'Proof of business insurance coverage',
      required: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      validationRules: ['Must be current and valid', 'Must show coverage amounts']
    },
    {
      id: 'tax_id',
      name: 'Tax ID Number',
      description: 'EIN or tax identification number',
      required: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      validationRules: ['Must be clearly visible', 'Must match business name']
    },
    {
      id: 'professional_certification',
      name: 'Professional Certification',
      description: 'Industry-specific certifications or licenses',
      required: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      validationRules: ['Must be current and valid', 'Must be from recognized authority']
    },
    {
      id: 'portfolio_samples',
      name: 'Portfolio Samples',
      description: 'Examples of previous work',
      required: false,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'],
      validationRules: ['Must be high quality', 'Must be original work']
    },
    {
      id: 'references',
      name: 'Client References',
      description: 'Letters of recommendation from clients',
      required: false,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      validationRules: ['Must be signed', 'Must include contact information']
    }
  ];

  async submitVerificationDocument(request: VerificationRequest): Promise<VerificationResult> {
    try {
      // Validate document type
      const documentType = this.documentTypes.find(dt => dt.id === request.documentType);
      if (!documentType) {
        return {
          success: false,
          status: 'rejected',
          message: 'Invalid document type',
          rejectionReason: 'Document type not recognized'
        };
      }

      // Validate file size
      if (request.fileSize > documentType.maxFileSize) {
        return {
          success: false,
          status: 'rejected',
          message: 'File size exceeds maximum allowed',
          rejectionReason: `File size ${request.fileSize} bytes exceeds maximum ${documentType.maxFileSize} bytes`
        };
      }

      // Validate MIME type
      if (!documentType.allowedMimeTypes.includes(request.mimeType)) {
        return {
          success: false,
          status: 'rejected',
          message: 'File type not allowed',
          rejectionReason: `File type ${request.mimeType} not allowed for ${documentType.name}`
        };
      }

      // Create document record
      const document = new Document({
        userId: request.userId,
        documentType: request.documentType,
        url: request.documentUrl,
        fileName: request.fileName,
        fileSize: request.fileSize,
        mimeType: request.mimeType,
        status: 'pending',
        uploadDate: new Date(),
        additionalInfo: request.additionalInfo
      });

      await document.save();

      // Update user profile verification status
      await this.updateVerificationStatus(request.userId, 'pending');

      // Send notification to admins
      await this.notifyAdminsOfNewDocument(document);

      return {
        success: true,
        status: 'pending',
        message: 'Document submitted successfully and is under review'
      };
    } catch (error) {
      console.error('Error submitting verification document:', error);
      return {
        success: false,
        status: 'rejected',
        message: 'Failed to submit document',
        rejectionReason: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async reviewDocument(
    documentId: string, 
    adminId: string, 
    action: 'approve' | 'reject', 
    rejectionReason?: string
  ): Promise<VerificationResult> {
    try {
      const document = await Document.findById(documentId);
      if (!document) {
        return {
          success: false,
          status: 'rejected',
          message: 'Document not found'
        };
      }

      // Update document status
      document.status = action === 'approve' ? 'approved' : 'rejected';
      document.rejectionReason = action === 'reject' ? rejectionReason : undefined;
      document.verifiedBy = adminId;
      document.verifiedAt = new Date();

      await document.save();

      // Update user profile verification status
      await this.updateVerificationStatus(document.userId, action === 'approve' ? 'approved' : 'rejected');

      // Send notification to user
      await this.notifyUserOfDocumentReview(document);

      return {
        success: true,
        status: document.status,
        message: action === 'approve' ? 'Document approved successfully' : 'Document rejected',
        rejectionReason: document.rejectionReason,
        verifiedBy: adminId,
        verifiedAt: document.verifiedAt
      };
    } catch (error) {
      console.error('Error reviewing document:', error);
      return {
        success: false,
        status: 'pending',
        message: 'Failed to review document',
        rejectionReason: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getVerificationStatus(userId: string): Promise<{
    overallStatus: string;
    documents: any[];
    missingDocuments: string[];
    progress: number;
  }> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const documents = await Document.find({ userId });
      const requiredDocumentTypes = this.documentTypes.filter(dt => dt.required);
      
      const missingDocuments = requiredDocumentTypes
        .filter(dt => !documents.some(doc => doc.documentType === dt.id && doc.status === 'approved'))
        .map(dt => dt.name);

      const approvedDocuments = documents.filter(doc => doc.status === 'approved').length;
      const totalRequired = requiredDocumentTypes.length;
      const progress = totalRequired > 0 ? (approvedDocuments / totalRequired) * 100 : 100;

      let overallStatus = 'pending';
      if (progress === 100) {
        overallStatus = 'verified';
      } else if (progress > 0) {
        overallStatus = 'partially_verified';
      }

      return {
        overallStatus,
        documents,
        missingDocuments,
        progress
      };
    } catch (error) {
      console.error('Error getting verification status:', error);
      throw error;
    }
  }

  async getPendingVerifications(): Promise<any[]> {
    try {
      const pendingDocuments = await Document.find({ status: 'pending' })
        .populate('userId', 'name email role')
        .sort({ uploadDate: 1 });

      return pendingDocuments;
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      throw error;
    }
  }

  async getUserDocuments(userId: string): Promise<any[]> {
    try {
      const documents = await Document.find({ userId }).sort({ uploadDate: -1 });
      return documents;
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw error;
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    try {
      const document = await Document.findOne({ _id: documentId, userId });
      if (!document) {
        return false;
      }

      // Only allow deletion of pending documents
      if (document.status !== 'pending') {
        return false;
      }

      await Document.findByIdAndDelete(documentId);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  private async updateVerificationStatus(userId: string, status: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      if (user.role === 'vendor') {
        await VendorProfile.findOneAndUpdate(
          { userId },
          { 
            verificationStatus: status,
            isVerified: status === 'approved'
          }
        );
      } else if (user.role === 'wedding_planner') {
        await WeddingPlannerProfile.findOneAndUpdate(
          { userId },
          { 
            verificationStatus: status,
            isVerified: status === 'approved'
          }
        );
      }

      // Update user verification status
      await User.findByIdAndUpdate(userId, { isVerified: status === 'approved' });
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  }

  private async notifyAdminsOfNewDocument(document: any): Promise<void> {
    try {
      const admins = await User.find({ role: { $in: ['admin', 'maintainer'] } });
      
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: 'New Document Verification Request',
          html: `
            <h2>New Document Verification Request</h2>
            <p>A new document has been submitted for verification:</p>
            <ul>
              <li><strong>User:</strong> ${document.userId}</li>
              <li><strong>Document Type:</strong> ${document.documentType}</li>
              <li><strong>File:</strong> ${document.fileName}</li>
              <li><strong>Submitted:</strong> ${document.uploadDate.toLocaleDateString()}</li>
            </ul>
            <p>Please review this document in the admin dashboard.</p>
          `
        });
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }

  private async notifyUserOfDocumentReview(document: any): Promise<void> {
    try {
      const user = await User.findById(document.userId);
      if (!user) return;

      const subject = document.status === 'approved' 
        ? 'Document Verification Approved' 
        : 'Document Verification Rejected';

      const message = document.status === 'approved'
        ? `
          <h2>Document Verification Approved</h2>
          <p>Congratulations! Your ${document.documentType} has been approved.</p>
          <p>Your account verification status has been updated.</p>
        `
        : `
          <h2>Document Verification Rejected</h2>
          <p>Your ${document.documentType} has been rejected for the following reason:</p>
          <p><strong>Reason:</strong> ${document.rejectionReason}</p>
          <p>Please review the requirements and submit a new document.</p>
        `;

      await sendEmail({
        to: user.email,
        subject,
        html: message
      });
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }

  // Get document type information
  getDocumentTypes(): DocumentType[] {
    return this.documentTypes;
  }

  getDocumentType(id: string): DocumentType | undefined {
    return this.documentTypes.find(dt => dt.id === id);
  }

  // Validate document before upload
  validateDocument(
    documentType: string, 
    fileSize: number, 
    mimeType: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const docType = this.getDocumentType(documentType);

    if (!docType) {
      errors.push('Invalid document type');
      return { isValid: false, errors };
    }

    if (fileSize > docType.maxFileSize) {
      errors.push(`File size exceeds maximum allowed (${docType.maxFileSize / (1024 * 1024)}MB)`);
    }

    if (!docType.allowedMimeTypes.includes(mimeType)) {
      errors.push(`File type not allowed. Allowed types: ${docType.allowedMimeTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default DocumentVerificationService.getInstance(); 