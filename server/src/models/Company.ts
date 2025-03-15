import mongoose from 'mongoose';

export interface ICompany {
  name: string;
  industry?: string;
  website?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  revenue?: number;
  status: 'prospect' | 'customer' | 'partner';
  assignedTo: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String
  },
  website: {
    type: String
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  revenue: {
    type: Number
  },
  status: {
    type: String,
    required: true,
    enum: ['prospect', 'customer', 'partner'],
    default: 'prospect'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for contacts
companySchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'company'
});

// Virtual for deals
companySchema.virtual('deals', {
  ref: 'Deal',
  localField: '_id',
  foreignField: 'company'
});

// Indexes
companySchema.index({ name: 1 }, { unique: true });
companySchema.index({ assignedTo: 1 });

export const Company = mongoose.model<ICompany>('Company', companySchema); 