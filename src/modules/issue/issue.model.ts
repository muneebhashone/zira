import { Document, model, Schema, Types } from 'mongoose';

export interface IIssue {
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  comments?: Types.ObjectId[];
  labels?: Types.ObjectId[];
  sprint: Types.ObjectId;
}

export interface IIssueDocument extends Document, IIssue {}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    project: { type: Types.ObjectId, ref: 'Project', required: true },
    assignee: { type: Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    labels: [{ type: Types.ObjectId, ref: 'Label' }],
    sprint: { type: Schema.Types.ObjectId, ref: 'Sprint', required: true },
  },
  { timestamps: true },
);

export const Issue = model<IIssue>('Issue', IssueSchema);
