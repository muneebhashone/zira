import { IIssue } from '../issue/issue.model';
import { ISprint } from './sprint.model';

export type SprintWithIssuesType = ISprint & { issues: IIssue[] };
