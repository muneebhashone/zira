import { Schema } from 'mongoose';
import { getSprintsByProjectId } from '../sprint/sprint.services';
import { UserType } from '../user/user.dto';
import { getUserById } from '../user/user.services';
import { ProjectType } from './project.dto';
import { IProject, Project } from './project.model';
import { ProjectInput, ProjectOptions } from './project.schema';

export const createProject = async (
  projectData: ProjectInput,
): Promise<IProject> => {
  const owner = await getUserById(projectData.owner);
  if (!owner) {
    throw new Error('Owner not found.');
  }

  const project = new Project({
    ...projectData,
    members: projectData.members ? projectData.members : [projectData.owner],
  });

  return await project.save();
};

export const addMemberToProject = async (
  projectId: string,
  userId: string,
): Promise<IProject | null> => {
  const project = await Project.findById(projectId);
  const user = await getUserById(userId);

  if (!project || !user) {
    throw new Error('Project or User not found.');
  }

  if (project.members.includes(new Schema.Types.ObjectId(userId))) {
    throw new Error('User is already a member of the project.');
  }

  project.members.push(new Schema.Types.ObjectId(userId));
  return await project.save();
};

export const getProjectById = async (
  projectId: string,
  options?: ProjectOptions,
): Promise<ProjectType> => {
  const project = await Project.findById(projectId).populate<{
    owner: UserType;
    members: UserType[];
  }>(['owner', 'members']);

  if (!project) {
    throw new Error('Project not found.');
  }

  if (options?.includeSprints) {
    const sprints = await getSprintsByProjectId(projectId, {
      includeIssues: options.includeIssues,
    });

    return {
      ...project.toObject(),
      sprints,
    } as ProjectType;
  }

  return project.toObject();
};
