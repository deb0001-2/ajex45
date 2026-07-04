import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AnnouncementPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IAnnouncement {
  title: string;
  description: string;
  image?: string;
  department?: mongoose.Types.ObjectId;  // null = company-wide
  priority: AnnouncementPriority;
  expiryDate?: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface IAnnouncementDocument extends IAnnouncement, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const AnnouncementSchema = new Schema<IAnnouncementDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: { type: String },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'] as AnnouncementPriority[],
      default: 'Medium',
    },
    expiryDate: { type: Date, index: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

AnnouncementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
AnnouncementSchema.index({ department: 1, priority: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Announcement: Model<IAnnouncementDocument> =
  mongoose.model<IAnnouncementDocument>('Announcement', AnnouncementSchema);

export default Announcement;
