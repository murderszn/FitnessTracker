import mongoose from 'mongoose';

interface IRelatedTo {
  type: 'contact' | 'company' | 'deal';
  id: mongoose.Types.ObjectId;
}

export interface IActivity {
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  date: Date;
  duration?: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  assignedTo: mongoose.Types.ObjectId;
  relatedTo?: IRelatedTo;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new mongoose.Schema<IActivity>({
  type: {
    type: String,
    required: true,
    enum: ['call', 'email', 'meeting', 'task']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'scheduled', 'cancelled'],
    default: 'scheduled'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['contact', 'company', 'deal']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedTo.type'
    }
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

// Virtual for related entity
activitySchema.virtual('relatedEntity', {
  ref: function(this: { relatedTo?: IRelatedTo }) {
    if (!this.relatedTo) return null;
    switch (this.relatedTo.type) {
      case 'contact': return 'Contact';
      case 'company': return 'Company';
      case 'deal': return 'Deal';
      default: return null;
    }
  },
  localField: 'relatedTo.id',
  foreignField: '_id',
  justOne: true
});

// Indexes
activitySchema.index({ type: 1 });
activitySchema.index({ date: 1 });
activitySchema.index({ assignedTo: 1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema); 