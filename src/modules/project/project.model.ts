import { Document, model, Schema } from 'mongoose';

export interface IProject {
  name: string;
  description?: string;
  owner: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

export interface IProjectDocument extends Document, IProject {}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const Project = model<IProject>('Project', ProjectSchema);
