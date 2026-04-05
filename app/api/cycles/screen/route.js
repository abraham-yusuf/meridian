import { withAuth, ok, ROLES } from "../../../../web/lib/http.js";
import { runLockedJob } from "../../../../runtime/web-jobs.js";
import { runScreeningOnce } from "../../../../runtime/web-services.js";

export const POST = withAuth(async () => {
  const result = await runLockedJob("screen", () => runScreeningOnce(), { retries: 1 });
  return ok(result);
}, ROLES.WRITE);
