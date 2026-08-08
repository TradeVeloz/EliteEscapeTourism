import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieBaseOptions,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${REFRESH_COOKIE}=([^;]+)`));
  const rawToken = match?.[1];

  if (!rawToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tokenHash = hashRefreshToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date() || stored.user.status !== "ACTIVE") {
    const response = NextResponse.json({ error: "Session expired" }, { status: 401 });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  // Rotate: revoke the used refresh token and issue a new one.
  const fresh = generateRefreshToken();
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: { userId: stored.userId, tokenHash: fresh.hash, expiresAt: fresh.expiresAt },
    }),
  ]);

  const accessToken = signAccessToken({
    sub: stored.user.id,
    role: stored.user.role,
    email: stored.user.email,
  });

  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.set(ACCESS_COOKIE, accessToken, { ...cookieBaseOptions, maxAge: 15 * 60 });
  response.cookies.set(REFRESH_COOKIE, fresh.token, { ...cookieBaseOptions, maxAge: 30 * 24 * 60 * 60 });
  return response;
}
