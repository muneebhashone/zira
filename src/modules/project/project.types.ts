import { SprintWithIssuesType } from '../sprint/sprint.types';
import { IProject } from './project.model';

export type ProjectWithSprintsType = IProject & {
  sprints: SprintWithIssuesType[];
};
