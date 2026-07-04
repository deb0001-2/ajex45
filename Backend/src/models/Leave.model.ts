import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeaveType = 'Paid' | 'Casual' | 'Sick' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ILeave {
  user: mongoose.Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  attachment?: string;
  status: LeaveStatus;
  approvedBy?: mongoose.Types.ObjectId;
  comments?: string;
  appliedAt: Date;
  leaveBalanceAfterApproval?: number;
}

export interface ILeaveDocument extends ILeave, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const LeaveSchema = new Schema<ILeaveDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    leaveType: {
      type: String,
      enum: ['Paid', 'Casual', 'Sick', 'Unpaid'] as LeaveType[],
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: 1,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    attachment: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'] as LeaveStatus[],
      default: 'Pending',
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: { type: String, trim: true },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    leaveBalanceAfterApproval: { type: Number },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

LeaveSchema.index({ user: 1, status: 1 });
LeaveSchema.index({ startDate: 1, endDate: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Leave: Model<ILeaveDocument> =
  mongoose.model<ILeaveDocument>('Leave', LeaveSchema);

export default Leave;
