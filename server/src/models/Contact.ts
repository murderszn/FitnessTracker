import mongoose from 'mongoose';
import { IUser } from './User.js';

export interface IContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: mongoose.Types.ObjectId;
  title?: string;
  status: 'active' | 'inactive' | 'lead';
  assignedTo: mongoose.Types.ObjectId;
  lastContact?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  phone: {
    type: String
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'lead'],
    default: 'lead'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastContact: {
    type: Date
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

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes
contactSchema.index({ email: 1 }, { unique: true });
contactSchema.index({ company: 1 });
contactSchema.index({ assignedTo: 1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema); 