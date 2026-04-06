import { withAuth, ok, badRequest, ROLES } from "../../../web/lib/http.js";
import { getBlacklist, blacklistAdd, blacklistRemove } from "../../../runtime/web-services.js";
import { blacklistAddSchema, blacklistRemoveSchema } from "../../../web/lib/validators.js";

export const GET = withAuth(async () => ok(getBlacklist()), ROLES.READ);

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = blacklistAddSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(blacklistAdd(parsed.data));
}, ROLES.WRITE);

export const DELETE = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = blacklistRemoveSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(blacklistRemove(parsed.data));
}, ROLES.WRITE);
