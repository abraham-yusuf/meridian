import { withAuth, ok, ROLES } from "../../../../web/lib/http.js";
import { runLockedJob } from "../../../../runtime/web-jobs.js";
import { runManagementOnce } from "../../../../runtime/web-services.js";

export const POST = withAuth(async () => {
  const result = await runLockedJob("manage", () => runManagementOnce(), { retries: 1 });
  return ok(result);
}, ROLES.WRITE);
