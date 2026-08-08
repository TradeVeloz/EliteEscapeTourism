import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mfaVerifySchema } from "@/lib/validation";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieBaseOptions,
  generateRefreshToken,
  signAccessToken,
  verifyMfaToken,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`auth:mfa:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = mfaVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  const { userId, token } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.mfaEnabled || !user.mfaSecret || user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  if (!verifyMfaToken(user.mfaSecret, token)) {
    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refresh = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: refresh.hash, expiresAt: refresh.expiresAt },
  });

  const response = NextResponse.json({
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  response.cookies.set(ACCESS_COOKIE, accessToken, { ...cookieBaseOptions, maxAge: 15 * 60 });
  response.cookies.set(REFRESH_COOKIE, refresh.token, {
    ...cookieBaseOptions,
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
