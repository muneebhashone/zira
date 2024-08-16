import { Document, model, Schema } from 'mongoose';

export interface ISprint {
  name: string;
  project: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

export interface ISprintDocument extends Document, ISprint {}

const SprintSchema = new Schema<ISprint>(
  {
    name: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Sprint = model<ISprint>('Sprint', SprintSchema);
