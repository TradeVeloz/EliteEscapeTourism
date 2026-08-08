import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieBaseOptions,
  generateRefreshToken,
  hashPassword,
  signAccessToken,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`auth:register:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration details" }, { status: 422 });
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Generic message — do not reveal whether the account exists.
    return NextResponse.json({ error: "Unable to create account with these details" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // No email-verification pipeline is wired up yet (would need SMTP), so
  // new accounts are activated immediately rather than left PENDING forever.
  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash, status: "ACTIVE" },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refresh = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: refresh.hash, expiresAt: refresh.expiresAt },
  });

  const response = NextResponse.json(
    { data: { id: user.id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
  response.cookies.set(ACCESS_COOKIE, accessToken, { ...cookieBaseOptions, maxAge: 15 * 60 });
  response.cookies.set(REFRESH_COOKIE, refresh.token, {
    ...cookieBaseOptions,
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
