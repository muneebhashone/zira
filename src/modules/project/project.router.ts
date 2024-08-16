import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import { handleCreateProject } from './project.controller';
import { projectInputSchema } from './project.schema';

export const PROJECT_ROUTER_ROOT = '/projects';

const projectRouter = new MagicRouter(PROJECT_ROUTER_ROOT);

projectRouter.post(
  '/',
  { requestType: { body: projectInputSchema } },
  canAccess(),
  handleCreateProject,
);

export default projectRouter.getRouter();
