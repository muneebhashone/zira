import { Document, model, Schema } from 'mongoose';

export interface ILabel extends Document {
  name: string;
  color: string;
}

const LabelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

export const Label = model<ILabel>('Label', LabelSchema);
