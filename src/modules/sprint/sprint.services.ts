import { getIssuesBySprintId } from '../issue/issue.services';
import { Sprint } from './sprint.model';
import { SprintOptions } from './sprint.schema';
import { SprintWithIssuesType } from './sprint.types';

export const getSprintById = async (
  sprintId: string,
  options?: SprintOptions,
): Promise<SprintWithIssuesType> => {
  const sprint = await Sprint.findById(sprintId);

  if (!sprint) {
    throw new Error('Sprint not found');
  }

  if (options?.includeIssues) {
    const sprintWithIssues = {
      ...sprint.toObject(),
      issues: await getIssuesBySprintId(sprint.id),
    } as unknown as SprintWithIssuesType;

    return sprintWithIssues;
  }

  return sprint.toObject();
};

export const getSprintsByProjectId = async (
  projectId: string,
  options: SprintOptions,
): Promise<SprintWithIssuesType[]> => {
  const sprints = await Sprint.find({ project: projectId });

  if (options?.includeIssues) {
    const issues = await getIssuesBySprintId(
      sprints.map((sprint) => sprint.id),
    );

    return sprints.map((sprint) => {
      return {
        ...sprint.toObject(),
        issues: issues.filter((issue) => issue.sprint.toString() === sprint.id),
      } as unknown as SprintWithIssuesType;
    });
  }

  return sprints.map((sprint) => sprint.toObject());
};
