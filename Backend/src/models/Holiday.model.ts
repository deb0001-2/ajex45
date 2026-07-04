import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type HolidayType = 'National' | 'Company' | 'Optional';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IHoliday {
  holidayName: string;
  holidayDate: Date;
  holidayType: HolidayType;
  description?: string;
  department?: mongoose.Types.ObjectId;
}

export interface IHolidayDocument extends IHoliday, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const HolidaySchema = new Schema<IHolidayDocument>(
  {
    holidayName: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true,
    },
    holidayDate: {
      type: Date,
      required: [true, 'Holiday date is required'],
      index: true,
    },
    holidayType: {
      type: String,
      enum: ['National', 'Company', 'Optional'] as HolidayType[],
      required: [true, 'Holiday type is required'],
    },
    description: { type: String, trim: true },
    // If set, this holiday applies only to a specific department
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

HolidaySchema.index({ holidayDate: 1, holidayType: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Holiday: Model<IHolidayDocument> =
  mongoose.model<IHolidayDocument>('Holiday', HolidaySchema);

export default Holiday;
