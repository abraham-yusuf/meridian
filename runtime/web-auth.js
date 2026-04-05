export const ROLES = {
  READ: "read",
  WRITE: "write",
  ADMIN: "admin",
};

function tokenFromHeader(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}

export function getRequestRole(request) {
  const token = tokenFromHeader(request);
  if (!token) return null;

  const adminToken = process.env.WEB_ADMIN_TOKEN || "";
  const writeToken = process.env.WEB_WRITE_TOKEN || "";
  const readToken = process.env.WEB_READ_TOKEN || "";

  if (adminToken && token === adminToken) return ROLES.ADMIN;
  if (writeToken && token === writeToken) return ROLES.WRITE;
  if (readToken && token === readToken) return ROLES.READ;
  return null;
}

export function hasPermission(role, required) {
  if (!role) return false;
  if (role === ROLES.ADMIN) return true;
  if (required === ROLES.READ) return [ROLES.READ, ROLES.WRITE].includes(role);
  if (required === ROLES.WRITE) return role === ROLES.WRITE;
  return false;
}
