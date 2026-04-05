import { withAuth, ok, badRequest, ROLES } from "../../../web/lib/http.js";
import { getConfig, updateConfig } from "../../../runtime/web-services.js";
import { configUpdateSchema } from "../../../web/lib/validators.js";

export const GET = withAuth(async () => {
  return ok(await getConfig());
}, ROLES.READ);

export const POST = withAuth(async (request) => {
  const body = await request.json().catch(() => null);
  const parsed = configUpdateSchema.safeParse(body);
  if (!parsed.success) return badRequest("invalid payload", parsed.error.flatten());
  const result = await updateConfig(parsed.data.changes, parsed.data.reason);
  return ok(result);
}, ROLES.WRITE);
