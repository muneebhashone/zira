import { getIssueById } from '../issue/issue.services';
import { Comment, IComment } from './comment.model';
import { CommentInput } from './comment.schema';

export const addComment = async (
  commentData: CommentInput,
): Promise<IComment> => {
  const issue = await getIssueById(commentData.issue);
  if (!issue) {
    throw new Error('Issue not found.');
  }

  const comment = new Comment(commentData);
  return await comment.save();
};
