import mongoose, { Document, Model, Types } from 'mongoose';

export interface IDiary extends Document {
  userId: Types.ObjectId;
  studentName: string;
  studentGroup?: string;
  startTime: string;
  color: string;
  state: string;
  taste: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiarySchema = new mongoose.Schema<IDiary>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentGroup: {
      type: String,
    },
    startTime: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    taste: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Diary as Model<IDiary>) || mongoose.model<IDiary>('Diary', DiarySchema);
