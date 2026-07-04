import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PayrollStatus = 'Pending' | 'Processed';
export type PaymentMethod = 'Bank Transfer' | 'Cheque' | 'Cash';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IPayroll {
  user: mongoose.Types.ObjectId;
  month: number;          // 1–12
  year: number;
  basicSalary: number;
  hra: number;            // House Rent Allowance
  medicalAllowance: number;
  travelAllowance: number;
  bonus: number;
  allowances: number;     // any other allowances
  deductions: number;     // any other deductions
  tax: number;            // income tax
  pf: number;             // provident fund
  netSalary: number;
  paymentMethod?: PaymentMethod;
  paymentDate?: Date;
  status: PayrollStatus;
  generatedBy?: mongoose.Types.ObjectId;
  payslipUrl?: string;
}

export interface IPayrollDocument extends IPayroll, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const PayrollSchema = new Schema<IPayrollDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2000,
    },
    basicSalary: { type: Number, required: true, min: 0 },
    hra: { type: Number, default: 0, min: 0 },
    medicalAllowance: { type: Number, default: 0, min: 0 },
    travelAllowance: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    pf: { type: Number, default: 0, min: 0 },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Cheque', 'Cash'] as PaymentMethod[],
      default: 'Bank Transfer',
    },
    paymentDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Processed'] as PayrollStatus[],
      default: 'Pending',
      index: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    payslipUrl: { type: String },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// One payroll record per employee per month per year
PayrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });
PayrollSchema.index({ year: 1, month: 1, status: 1 });

// ─── Export Model ─────────────────────────────────────────────────────────────

const Payroll: Model<IPayrollDocument> =
  mongoose.model<IPayrollDocument>('Payroll', PayrollSchema);

export default Payroll;
