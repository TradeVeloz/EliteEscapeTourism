import { ACCESS_COOKIE, verifyAccessToken, type AccessTokenPayload } from "@/lib/auth";
import type { Role } from "@prisma/client";

/**
 * Reads and verifies the access-token cookie inside a Route Handler
 * (Node.js runtime, where `jsonwebtoken`'s crypto usage is supported).
 * `middleware.ts` only does a cheap cookie-presence check for page
 * redirects — this is the actual authorization boundary.
 */
export function getAuthUser(request: Request): AccessTokenPayload | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${ACCESS_COOKIE}=([^;]+)`));
  const token = match?.[1];
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function hasRole(user: AccessTokenPayload | null, allowed: Role[]): boolean {
  return !!user && allowed.includes(user.role);
}
