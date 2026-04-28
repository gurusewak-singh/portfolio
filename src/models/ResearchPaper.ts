import mongoose, { Schema, Document } from "mongoose";

export interface IResearchPaper extends Document {
  title: string;
  authors: string[];
  abstract: string;
  topics: string[];
  publishedYear?: number;
  externalUrl?: string; // arXiv / journal / DOI link
  pdfFile?: string; // base64 data URI or hosted URL
  pdfFilename?: string; // suggested download name
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchPaperSchema = new Schema<IResearchPaper>(
  {
    title: { type: String, required: true },
    authors: [{ type: String }],
    abstract: { type: String, required: true },
    topics: [{ type: String }],
    publishedYear: { type: Number },
    externalUrl: { type: String },
    pdfFile: { type: String },
    pdfFilename: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.ResearchPaper ||
  mongoose.model<IResearchPaper>("ResearchPaper", ResearchPaperSchema);
