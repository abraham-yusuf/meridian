import { withAuth, ok, ROLES } from "../../../web/lib/http.js";
import { getJobStatuses } from "../../../runtime/web-jobs.js";

export const GET = withAuth(async () => ok({ jobs: getJobStatuses() }), ROLES.READ);
