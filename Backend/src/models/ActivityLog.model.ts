import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IActivityLog {
  user: mongoose.Types.ObjectId;
  action: string;
  description?: string;
  device?: string;
  browser?: string;
  ipAddress?: string;
}

export interface IActivityLogDocument extends IActivityLog, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    device: { type: String, trim: true },
    browser: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
  },
  {
    timestamps: true,
    // Activity logs are append-only and queried by recency
    capped: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

ActivityLogSchema.index({ user: 1, createdAt: -1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const ActivityLog: Model<IActivityLogDocument> =
  mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
