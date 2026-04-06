import { NextResponse } from "next/server";
import { getRequestRole, hasPermission, ROLES } from "../../runtime/web-auth.js";

export function ok(data, init = {}) {
  return NextResponse.json(data, init);
}

export function badRequest(message, details = null) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function forbidden() {
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export function withAuth(handler, required = ROLES.READ) {
  return async (request, ctx) => {
    const role = getRequestRole(request);
    if (!hasPermission(role, required)) return forbidden();
    return handler(request, ctx, role);
  };
}

export { ROLES };
