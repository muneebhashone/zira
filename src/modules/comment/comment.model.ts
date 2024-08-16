import { Document, model, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  issue: Schema.Types.ObjectId;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
  },
  { timestamps: true },
);

export const Comment = model<IComment>('Comment', CommentSchema);
