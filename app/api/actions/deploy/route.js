import { withAuth, ok, badRequest, ROLES } from "../../../../web/lib/http.js";
import { deployAction } from "../../../../runtime/web-services.js";
import { deploySchema } from "../../../../web/lib/validators.js";

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = deploySchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  return ok(await deployAction(parsed.data));
}, ROLES.WRITE);
