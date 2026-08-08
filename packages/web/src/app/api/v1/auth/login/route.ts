import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieBaseOptions,
  generateRefreshToken,
  signAccessToken,
  verifyPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const GENERIC_ERROR = { error: "Invalid email or password" };

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`auth:login:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(GENERIC_ERROR, { status: 401 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json(GENERIC_ERROR, { status: 401 });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json(GENERIC_ERROR, { status: 401 });
  }

  if (user.mfaEnabled) {
    return NextResponse.json({ data: { mfaRequired: true, userId: user.id } }, { status: 200 });
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
