import { withAuth, ok, badRequest, ROLES } from "../../../web/lib/http.js";
import { readPoolMemory } from "../../../runtime/web-services.js";

export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const pool = searchParams.get("pool");
  if (!pool) return badRequest("pool query param is required");
  return ok(readPoolMemory(pool));
}, ROLES.READ);
