import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IssueInput } from './issue.schema';
import { createIssue } from './issue.services';
import { successResponse } from '../../utils/api.utils';

export const handleCreateIssue = async (
  req: Request<unknown, unknown, IssueInput>,
  res: Response,
) => {
  const issueData = req.body;
  const issue = await createIssue(issueData);

  return successResponse(
    res,
    'Issue created successfully',
    issue,
    StatusCodes.CREATED,
  );
};
