import mongoose from 'mongoose';

interface IRelatedTo {
  type: 'contact' | 'company' | 'deal';
  id: mongoose.Types.ObjectId;
}

export interface ITask {
  title: string;
  description?: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  relatedTo?: IRelatedTo;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['Todo', 'In Progress', 'Review', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
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
taskSchema.virtual('relatedEntity', {
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
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema); 