import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  key: string;
  value: string;
  type: "image" | "text" | "json" | "file";
  label: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "text", "json", "file"],
      default: "text",
    },
    label: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
