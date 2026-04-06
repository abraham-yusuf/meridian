import { withAuth, ok, badRequest, ROLES } from "../../../../web/lib/http.js";
import { swapAction } from "../../../../runtime/web-services.js";
import { swapSchema } from "../../../../web/lib/validators.js";

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = swapSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(await swapAction(parsed.data));
}, ROLES.WRITE);
