import { getProjectById } from '../project/project.services';
import { UserType } from '../user/user.dto';
import { getUserById } from '../user/user.services';
import { IssueType } from './issue.dto';
import { Issue } from './issue.model';
import { IssueInput } from './issue.schema';

export const createIssue = async (
  issueData: IssueInput,
): Promise<IssueType> => {
  const project = await getProjectById(issueData.project);
  if (!project) {
    throw new Error('Project not found.');
  }

  if (issueData.assignee) {
    const assignee = await getUserById(issueData.assignee);
    if (!assignee) {
      throw new Error('Assignee not found.');
    }

    if (!project.members?.some((member) => String(member) === assignee._id)) {
      throw new Error('Assignee is not a member of the project.');
    }
  }

  const issue = new Issue(issueData);

  await issue.save();

  return issue.toObject();
};

export const getIssueById = async (
  issueId: string,
  includeAssignee?: boolean,
): Promise<IssueType> => {
  const issue = await Issue.findById(issueId).populate<{ assignee: UserType }>(
    includeAssignee ? 'assignee' : '',
  );

  if (!issue) {
    throw new Error('Issue not found');
  }

  return {
    ...issue.toObject(),
    sprintId: issue.sprint.toString(),
    projectId: issue.project.toString(),
  };
};

export const getIssuesBySprintId = async (
  sprintId: string | string[],
  includeAssignee?: boolean,
): Promise<IssueType[]> => {
  const issues = await Issue.find(
    Array.isArray(sprintId)
      ? { $in: { sprint: sprintId } }
      : { sprint: sprintId },
  ).populate<{ assignee: UserType }>(includeAssignee ? 'assignee' : '');

  return issues.map((issue) => issue.toObject());
};
