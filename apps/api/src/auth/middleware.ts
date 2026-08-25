import type { FastifyReply, FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";
import {
  SESSION_COOKIE,
  hashToken,
  verifyAccessToken,
} from "@altair/auth";
import { env } from "@altair/config";
import { getDb, sessions, users } from "@altair/database";
import type { PublicUser } from "@altair/types";

export type AuthUser = PublicUser;

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser | null;
  }
}

function toPublicUser(row: {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}): PublicUser {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    createdAt: row.createdAt.toISOString(),
  };
}

async function userFromSessionCookie(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;
  const db = getDb();
  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      createdAt: users.createdAt,
      expiresAt: sessions.expiresAt,
      sessionId: sessions.id,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, row.sessionId));
    return null;
  }
  return toPublicUser(row);
}

async function userFromBearer(header: string | undefined): Promise<AuthUser | null> {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  if (!token) return null;
  const claims = await verifyAccessToken(token, env().JWT_SECRET);
  if (!claims) return null;
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.id, claims.sub)).limit(1);
  const row = rows[0];
  return row ? toPublicUser(row) : null;
}

export async function attachUser(request: FastifyRequest): Promise<void> {
  request.user =
    (await userFromSessionCookie(request.cookies[SESSION_COOKIE])) ??
    (await userFromBearer(request.headers.authorization));
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (!request.user) {
    await attachUser(request);
  }
  if (!request.user) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

export function setSessionCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE, { path: "/" });
}

export { toPublicUser };
