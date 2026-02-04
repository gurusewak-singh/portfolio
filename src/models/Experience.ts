import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  position: string;
  description: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  current: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
