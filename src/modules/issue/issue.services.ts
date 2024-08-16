import { getProjectById } from '../project/project.services';
import { getUserById } from '../user/user.services';
import { IIssue, Issue } from './issue.model';
import { IssueInput } from './issue.schema';

export const createIssue = async (issueData: IssueInput): Promise<IIssue> => {
  const project = await getProjectById(issueData.project);
  if (!project) {
    throw new Error('Project not found.');
  }

  if (issueData.assignee) {
    const assignee = await getUserById(issueData.assignee);
    if (!assignee) {
      throw new Error('Assignee not found.');
    }

    if (!project.members.some((member) => String(member) === assignee._id)) {
      throw new Error('Assignee is not a member of the project.');
    }
  }

  const issue = new Issue(issueData);
  return await issue.save();
};

export const getIssueById = async (issueId: string): Promise<IIssue | null> => {
  return await Issue.findById(issueId);
};

export const getIssuesBySprintId = async (
  sprintId: string | string[],
): Promise<IIssue[]> => {
  const issues = await Issue.find(
    Array.isArray(sprintId)
      ? { $in: { sprint: sprintId } }
      : { sprint: sprintId },
  );

  return issues;
};
