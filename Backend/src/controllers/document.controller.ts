import { Request, Response } from 'express';
import UserDocument from '../models/Document.model';
import User from '../models/User.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/documents/upload
 * Admin or Self — Upload a document for a specific employee
 *
 * Multer middleware must run before this controller and attaches req.file.
 * The documentType must be sent as a form field alongside the file.
 */
const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  const { userId, documentType, documentName, documentNumber, expiryDate } =
    req.body as {
      userId: string;
      documentType: string;
      documentName: string;
      documentNumber?: string;
      expiryDate?: string;
    };

  // Access guard: Employee can only upload their own documents
  const isSelf = req.user!._id.toString() === userId;
  const isAdminOrHR =
    req.user!.role === 'Admin' || req.user!.role === 'HR';

  if (!isSelf && !isAdminOrHR) {
    throw new ApiError(403, 'You can only upload documents for your own profile.');
  }

  // Confirm target employee exists
  const employee = await User.findById(userId).select('fullName employeeId');
  if (!employee) {
    throw new ApiError(404, `No employee found with ID: ${userId}`);
  }

  // multer attaches the uploaded file to req.file
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded. Please attach a document.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  const doc = await UserDocument.create({
    user: userId,
    documentType: documentType as import('../models/Document.model').DocumentType,
    documentName,
    documentNumber,
    fileUrl,
    uploadDate: new Date(),
    expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    documentStatus: 'Pending',
  });

  await ActivityLog.create({
    user: req.user!._id,
    action: 'UPLOAD_DOCUMENT',
    description: `Uploaded ${documentType} for employee ${employee.employeeId}`,
    ipAddress: req.ip,
  });

  res.status(201).json(
    new ApiResponse(201, doc, 'Document uploaded successfully.')
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/documents/:userId
 * Admin or Self — Get all documents for a specific employee
 */
const getDocuments = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { documentType } = req.query as { documentType?: string };

  // Access guard
  const isSelf = req.user!._id.toString() === userId;
  const isAdminOrHR =
    req.user!.role === 'Admin' || req.user!.role === 'HR';

  if (!isSelf && !isAdminOrHR) {
    throw new ApiError(403, 'You can only view your own documents.');
  }

  const filter: Record<string, unknown> = { user: userId };
  if (documentType) filter.documentType = documentType;

  const documents = await UserDocument.find(filter)
    .populate('verifiedBy', 'fullName designation')
    .sort({ uploadDate: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, documents, 'Documents fetched successfully.')
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * PATCH /api/documents/:id/verify
 * Admin/HR only — Mark a document as Verified or Rejected
 */
const verifyDocument = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: 'Verified' | 'Rejected' };

  if (!['Verified', 'Rejected'].includes(status)) {
    throw new ApiError(400, "Status must be 'Verified' or 'Rejected'.");
  }

  const doc = await UserDocument.findByIdAndUpdate(
    id,
    {
      $set: {
        documentStatus: status,
        verified: status === 'Verified',
        verifiedBy: req.user!._id,
      },
    },
    { new: true }
  ).populate('user', 'fullName employeeId');

  if (!doc) {
    throw new ApiError(404, `No document found with ID: ${id}`);
  }

  await ActivityLog.create({
    user: req.user!._id,
    action: `DOCUMENT_${status.toUpperCase()}`,
    description: `${status} document: ${doc.documentName} for employee`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(200, doc, `Document ${status.toLowerCase()} successfully.`)
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * DELETE /api/documents/:id
 * Admin or Owner — Remove a document record (not the file from disk)
 */
const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const doc = await UserDocument.findById(id);
  if (!doc) {
    throw new ApiError(404, `No document found with ID: ${id}`);
  }

  const isSelf = req.user!._id.toString() === doc.user.toString();
  const isAdmin = req.user!.role === 'Admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(403, 'You can only delete your own documents.');
  }

  await UserDocument.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, { _id: id }, 'Document deleted successfully.')
  );
});

export { uploadDocument, getDocuments, verifyDocument, deleteDocument };
