import { getIssuesBySprintId } from '../issue/issue.services';
import { SprintType } from './sprint.dto';
import { Sprint } from './sprint.model';
import { SprintOptions } from './sprint.schema';

export const getSprintById = async (
  sprintId: string,
  options?: SprintOptions,
): Promise<SprintType> => {
  const sprint = await Sprint.findById(sprintId);

  if (!sprint) {
    throw new Error('Sprint not found');
  }

  if (options?.includeIssues) {
    const sprintWithIssues = {
      ...sprint.toObject(),
      issues: await getIssuesBySprintId(sprint.id),
    } as unknown as SprintType;

    return sprintWithIssues;
  }

  return sprint.toObject();
};

export const getSprintsByProjectId = async (
  projectId: string,
  options: SprintOptions,
): Promise<SprintType[]> => {
  const sprints = await Sprint.find({ project: projectId });

  if (options?.includeIssues) {
    const issues = await getIssuesBySprintId(
      sprints.map((sprint) => sprint.id),
    );

    return sprints.map((sprint) => {
      return {
        ...sprint.toObject(),
        issues: issues.filter((issue) => issue.sprintId === sprint.id),
      } as unknown as SprintType;
    });
  }

  return sprints.map((sprint) => sprint.toObject());
};
