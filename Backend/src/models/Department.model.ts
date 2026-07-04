import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IDepartment {
  departmentName: string;
  departmentCode: string;
  description?: string;
  manager?: mongoose.Types.ObjectId;
  employeeCount: number;
  isActive: boolean;
}

export interface IDepartmentDocument extends IDepartment, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const DepartmentSchema = new Schema<IDepartmentDocument>(
  {
    departmentName: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, trim: true },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    employeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ─── Export Model ─────────────────────────────────────────────────────────────

const Department: Model<IDepartmentDocument> =
  mongoose.model<IDepartmentDocument>('Department', DepartmentSchema);

export default Department;
