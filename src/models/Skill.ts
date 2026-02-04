import mongoose, { Schema, Document } from 'mongoose';

export type SkillCategory = 'ml' | 'frontend' | 'backend' | 'database' | 'tools' | 'other';

export interface ISkill extends Document {
  name: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['ml', 'frontend', 'backend', 'database', 'tools', 'other'],
      required: true 
    },
    proficiency: { type: Number, min: 1, max: 100, default: 50 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
