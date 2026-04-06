import { withAuth, ok, badRequest, ROLES } from "../../../../web/lib/http.js";
import { claimAction } from "../../../../runtime/web-services.js";
import { claimSchema } from "../../../../web/lib/validators.js";

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(await claimAction(parsed.data));
}, ROLES.WRITE);
