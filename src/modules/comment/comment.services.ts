import { getIssueById } from '../issue/issue.services';
import { CommentType } from './comment.dto';
import { Comment } from './comment.model';
import { CommentInput } from './comment.schema';

export const addComment = async (
  commentData: CommentInput,
): Promise<CommentType> => {
  const issue = await getIssueById(commentData.issue);

  if (!issue) {
    throw new Error('Issue not found.');
  }

  const comment = new Comment(commentData);
  await comment.save();

  return comment.toObject();
};
