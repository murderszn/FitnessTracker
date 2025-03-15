import mongoose from 'mongoose';

export interface ICompany {
  name: string;
  industry: string;
  location: string;
  website?: string;
  employees?: number;
  revenue?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  employees: {
    type: Number
  },
  revenue: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const CompanyModel = mongoose.model<ICompany>('Company', companySchema); 