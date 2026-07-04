import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type DocumentType =
  | 'Offer Letter'
  | 'Resume'
  | 'PAN'
  | 'Aadhaar'
  | 'National ID'
  | 'Certificate'
  | 'Experience Letter';

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IDocument {
  user: mongoose.Types.ObjectId;
  documentType: DocumentType;
  documentName: string;
  documentNumber?: string;
  fileUrl: string;
  uploadDate: Date;
  expiryDate?: Date;
  verified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  documentStatus: DocumentStatus;
}

export interface IDocumentDocument extends IDocument, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const DocumentSchema = new Schema<IDocumentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    documentType: {
      type: String,
      enum: [
        'Offer Letter',
        'Resume',
        'PAN',
        'Aadhaar',
        'National ID',
        'Certificate',
        'Experience Letter',
      ] as DocumentType[],
      required: [true, 'Document type is required'],
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    documentNumber: { type: String, trim: true },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: { type: Date },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    documentStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'] as DocumentStatus[],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

DocumentSchema.index({ user: 1, documentType: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const UserDocument: Model<IDocumentDocument> =
  mongoose.model<IDocumentDocument>('Document', DocumentSchema);

export default UserDocument;
