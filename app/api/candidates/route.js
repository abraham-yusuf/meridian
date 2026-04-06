import { withAuth, ok, ROLES } from "../../../web/lib/http.js";
import { getCandidates } from "../../../runtime/web-services.js";

export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(25, Number(searchParams.get("limit") || 10)));
  const data = await getCandidates(limit);
  return ok(data);
}, ROLES.READ);
