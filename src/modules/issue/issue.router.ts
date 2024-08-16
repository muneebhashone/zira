import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import { handleCreateIssue } from './issue.controller';
import { issueSchema } from './issue.dto';
import { issueInputSchema } from './issue.schema';

export const ISSUE_ROUTER_ROOT = '/issues';

export const issueRouter = new MagicRouter(ISSUE_ROUTER_ROOT);

issueRouter.post(
  '/',
  { requestType: { body: issueInputSchema }, responseModel: issueSchema },
  canAccess(),
  handleCreateIssue,
);

export default issueRouter.getRouter();
