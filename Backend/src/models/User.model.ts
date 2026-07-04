import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'HR' | 'Manager' | 'Employee';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Intern';
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

// ─── Sub-document interfaces ──────────────────────────────────────────────────

interface IContactInfo {
  phone: string;
  alternatePhone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface ILeaveBalance {
  paid: number;
  sick: number;
  casual: number;
  unpaid: number;
}

// ─── Main interface ───────────────────────────────────────────────────────────

export interface IUser {
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  department?: mongoose.Types.ObjectId;
  designation?: string;
  manager?: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  gender?: Gender;
  bloodGroup?: string;
  joiningDate?: Date;
  employmentType?: EmploymentType;
  experience?: number;
  skills: string[];
  contactInfo?: IContactInfo;
  profilePicture?: string;
  leaveBalance: ILeaveBalance;
  attendanceStreak: number;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

// Document type adds Mongoose's built-in helpers (save, _id, etc.)
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUserDocument>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned in queries unless explicitly selected
    },
    role: {
      type: String,
      enum: ['Admin', 'HR', 'Manager', 'Employee'] as UserRole[],
      default: 'Employee',
      index: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    designation: { type: String, trim: true },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'] as Gender[],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    joiningDate: { type: Date },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Intern'] as EmploymentType[],
      default: 'Full-Time',
    },
    experience: { type: Number, min: 0 },
    skills: [{ type: String, trim: true }],
    contactInfo: {
      phone: { type: String, trim: true },
      alternatePhone: { type: String, trim: true },
      address: { type: String, trim: true },
      emergencyContact: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        relation: { type: String, trim: true },
      },
    },
    profilePicture: { type: String },
    leaveBalance: {
      paid: { type: Number, default: 12 },
      sick: { type: Number, default: 6 },
      casual: { type: Number, default: 6 },
      unpaid: { type: Number, default: 0 },
    },
    attendanceStreak: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

UserSchema.index({ fullName: 'text', email: 'text' }); // for search
UserSchema.index({ department: 1, isActive: 1 });

// ─── Pre-save hook: hash password before saving ───────────────────────────────

UserSchema.pre('save', async function () {
  // Only hash if password field was modified
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});


// ─── Instance method: compare password ────────────────────────────────────────

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// ─── Export Model ─────────────────────────────────────────────────────────────

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  'User',
  UserSchema
);

export default User;
