import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentInput } from './comment.schema';
import { addComment } from './comment.services';
import { successResponse } from '../../utils/api.utils';

export const handleAddComment = async (
  req: Request<unknown, unknown, CommentInput>,
  res: Response,
) => {
  const commentData = req.body;
  const comment = await addComment(commentData);

  return successResponse(
    res,
    'Comment added successfully',
    comment,
    StatusCodes.CREATED,
  );
};
