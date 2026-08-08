import {
  generateMfaSecret,
  generateRefreshToken,
  hashPassword,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
  verifyMfaToken,
  verifyPassword,
} from "@/lib/auth";
import { authenticator } from "otplib";

describe("password hashing", () => {
  it("hashes a password and verifies the correct password against it", async () => {
    const hash = await hashPassword("Str0ngPassword!");
    expect(hash).not.toBe("Str0ngPassword!");
    await expect(verifyPassword("Str0ngPassword!", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Str0ngPassword!");
    await expect(verifyPassword("WrongPassword!", hash)).resolves.toBe(false);
  });
});

describe("access tokens", () => {
  it("round-trips a signed payload", () => {
    const token = signAccessToken({ sub: "user_1", role: "CLIENT", email: "a@example.com" });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("user_1");
    expect(payload.role).toBe("CLIENT");
    expect(payload.email).toBe("a@example.com");
  });

  it("throws on a tampered token", () => {
    const token = signAccessToken({ sub: "user_1", role: "CLIENT", email: "a@example.com" });
    expect(() => verifyAccessToken(`${token}tampered`)).toThrow();
  });
});

describe("refresh tokens", () => {
  it("generates an opaque token whose hash matches hashRefreshToken", () => {
    const { token, hash, expiresAt } = generateRefreshToken();
    expect(token).toHaveLength(96);
    expect(hashRefreshToken(token)).toBe(hash);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("produces different tokens on each call", () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a.token).not.toBe(b.token);
  });
});

describe("MFA (TOTP)", () => {
  it("verifies a code generated from the same secret", () => {
    const { secret, otpauthUrl } = generateMfaSecret("user@example.com");
    expect(otpauthUrl).toContain("Elite%20Escape%20Tourism");
    const code = authenticator.generate(secret);
    expect(verifyMfaToken(secret, code)).toBe(true);
  });

  it("rejects an incorrect code", () => {
    const { secret } = generateMfaSecret("user@example.com");
    const validCode = authenticator.generate(secret);
    const firstDigit = Number(validCode[0]);
    const wrongDigit = (firstDigit + 1) % 10;
    const wrongCode = `${wrongDigit}${validCode.slice(1)}`;
    expect(verifyMfaToken(secret, wrongCode)).toBe(false);
  });
});
