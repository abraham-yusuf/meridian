import { withAuth, ok, badRequest, ROLES } from "../../../../web/lib/http.js";
import { closeAction } from "../../../../runtime/web-services.js";
import { closeSchema } from "../../../../web/lib/validators.js";

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = closeSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(await closeAction(parsed.data));
}, ROLES.WRITE);
