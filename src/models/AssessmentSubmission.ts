import mongoose, { Document, Model, Types } from 'mongoose';

export interface IAssessmentSubmission extends Document {
  userId: Types.ObjectId;
  studentName: string;
  situationalAnswers: {
    questionId: string;
    studentAnswer: string;
  }[];
  emotion?: string;
  emotionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSubmissionSchema = new mongoose.Schema<IAssessmentSubmission>(
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
    situationalAnswers: [
      {
        questionId: { type: String, required: true },
        studentAnswer: { type: String, required: true },
      }
    ],
    emotion: {
      type: String,
    },
    emotionNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.AssessmentSubmission as Model<IAssessmentSubmission>) || mongoose.model<IAssessmentSubmission>('AssessmentSubmission', AssessmentSubmissionSchema);
