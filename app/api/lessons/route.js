import { withAuth, ok, ROLES } from "../../../web/lib/http.js";
import { getLessons } from "../../../runtime/web-services.js";

export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(200, Number(searchParams.get("limit") || 50)));
  return ok(getLessons(limit));
}, ROLES.READ);
