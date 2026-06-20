import mongoose, { Document, Model, Types } from 'mongoose';

export interface IProgress extends Document {
  userId: Types.ObjectId;
  completedSteps: string[];
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new mongoose.Schema<IProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    completedSteps: {
      type: [String],
      default: [],
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Progress as Model<IProgress>) || mongoose.model<IProgress>('Progress', ProgressSchema);
