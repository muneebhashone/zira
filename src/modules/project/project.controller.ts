import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProjectInput } from './project.schema';
import { addMemberToProject, createProject } from './project.services';
import { successResponse } from '../../utils/api.utils';
import { MongoIdSchemaType } from '../../common/common.schema';

export const handleCreateProject = async (
  req: Request<unknown, unknown, ProjectInput>,
  res: Response,
) => {
  const project = await createProject(req.body);

  return successResponse(
    res,
    'Project created successfully',
    project,
    StatusCodes.CREATED,
  );
};

export const handleAddMemberToProject = async (
  req: Request<MongoIdSchemaType, unknown, { userId: string }>,
  res: Response,
) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const project = await addMemberToProject(projectId, userId);

  if (!project) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send('Project not found or user already a member');
  }

  return successResponse(res, 'Member added to project successfully', project);
};
