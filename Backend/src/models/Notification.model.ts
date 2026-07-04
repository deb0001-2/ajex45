import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type NotificationType = 'Info' | 'Success' | 'Warning' | 'Alert';
export type NotificationPriority = 'Low' | 'Medium' | 'High';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface INotification {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  icon?: string;
  actionUrl?: string;
  isRead: boolean;
  expiresAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const NotificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Info', 'Success', 'Warning', 'Alert'] as NotificationType[],
      default: 'Info',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'] as NotificationPriority[],
      default: 'Medium',
    },
    icon: { type: String },
    actionUrl: { type: String },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

NotificationSchema.index({ user: 1, isRead: 1 });
// TTL index: auto-delete expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Notification: Model<INotificationDocument> =
  mongoose.model<INotificationDocument>('Notification', NotificationSchema);

export default Notification;
