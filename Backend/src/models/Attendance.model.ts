import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Half Day'
  | 'Leave';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IAttendance {
  user: mongoose.Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours?: number;
  breakDuration?: number;   // in minutes
  overtimeHours?: number;
  status: AttendanceStatus;
  location?: string;
  device?: string;
  ipAddress?: string;
  remarks?: string;
}

export interface IAttendanceDocument extends IAttendance, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const AttendanceSchema = new Schema<IAttendanceDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    workingHours: { type: Number, min: 0 },
    breakDuration: { type: Number, min: 0, default: 0 },
    overtimeHours: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Half Day', 'Leave'] as AttendanceStatus[],
      required: [true, 'Status is required'],
    },
    location: { type: String, trim: true },
    device: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Prevent duplicate attendance records for same user on same day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ status: 1, date: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Attendance: Model<IAttendanceDocument> =
  mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);

export default Attendance;
