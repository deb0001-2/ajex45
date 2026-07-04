import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Sub-document interfaces ──────────────────────────────────────────────────

interface IWorkingHours {
  start: string;   // "09:00"
  end: string;     // "18:00"
  hoursPerDay: number;
  workingDays: string[]; // ["Monday","Tuesday",...,"Friday"]
}

interface ILeavePolicy {
  paidLeavesPerYear: number;
  sickLeavesPerYear: number;
  casualLeavesPerYear: number;
  unpaidLeavesAllowed: boolean;
  carryForward: boolean;
}

interface IOfficeLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode?: string;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ICompanySettings {
  companyName: string;
  workingHours: IWorkingHours;
  officeLocation: IOfficeLocation;
  timezone: string;
  leavePolicy: ILeavePolicy;
  theme: 'light' | 'dark';
  logo?: string;
}

export interface ICompanySettingsDocument extends ICompanySettings, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CompanySettingsSchema = new Schema<ICompanySettingsDocument>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' },
      hoursPerDay: { type: Number, default: 8 },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    },
    officeLocation: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      pinCode: { type: String, trim: true },
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    leavePolicy: {
      paidLeavesPerYear: { type: Number, default: 12 },
      sickLeavesPerYear: { type: Number, default: 6 },
      casualLeavesPerYear: { type: Number, default: 6 },
      unpaidLeavesAllowed: { type: Boolean, default: true },
      carryForward: { type: Boolean, default: false },
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    logo: { type: String },
  },
  { timestamps: true }
);

// ─── Export Model ─────────────────────────────────────────────────────────────

const CompanySettings: Model<ICompanySettingsDocument> =
  mongoose.model<ICompanySettingsDocument>(
    'CompanySettings',
    CompanySettingsSchema
  );

export default CompanySettings;
