import { withAuth, ok, ROLES } from "../../../web/lib/http.js";
import { getDashboardData } from "../../../runtime/web-services.js";

export const GET = withAuth(async () => {
  const data = await getDashboardData();
  return ok(data);
}, ROLES.READ);
