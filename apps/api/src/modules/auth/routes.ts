import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  hashPassword,
  sessionExpiry,
  signAccessToken,
  verifyPassword,
  hashToken,
  SESSION_COOKIE,
} from "@altair/auth";
import { env } from "@altair/config";
import { getDb, sessions, users } from "@altair/database";
import { LoginSchema, RegisterSchema } from "@altair/validation";
import type { AuthResponse } from "@altair/types";
import {
  clearSessionCookie,
  requireAuth,
  setSessionCookie,
  toPublicUser,
} from "../../auth/middleware.js";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/auth/register", async (request, reply) => {
    const parsed = RegisterSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const { email, username, password } = parsed.data;
    const db = getDb();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    if (existing[0]) {
      return reply.code(409).send({ error: "Email already registered" });
    }

    const usernameTaken = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (usernameTaken[0]) {
      return reply.code(409).send({ error: "Username already taken" });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        username,
        passwordHash,
      })
      .returning();

    const user = inserted[0]!;
    const { token, tokenHash } = createSessionToken();
    await db.insert(sessions).values({
      userId: user.id,
      tokenHash,
      expiresAt: sessionExpiry(),
    });

    const accessToken = await signAccessToken(
      { sub: user.id, email: user.email, username: user.username },
      env().JWT_SECRET,
    );
    setSessionCookie(reply, token);

    const body: AuthResponse = {
      user: toPublicUser(user),
      accessToken,
    };
    return reply.code(201).send(body);
  });

  app.post("/api/auth/login", async (request, reply) => {
    const parsed = LoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    const user = rows[0];
    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const { token, tokenHash } = createSessionToken();
    await db.insert(sessions).values({
      userId: user.id,
      tokenHash,
      expiresAt: sessionExpiry(),
    });

    const accessToken = await signAccessToken(
      { sub: user.id, email: user.email, username: user.username },
      env().JWT_SECRET,
    );
    setSessionCookie(reply, token);

    const body: AuthResponse = {
      user: toPublicUser(user),
      accessToken,
    };
    return reply.send(body);
  });

  app.post("/api/auth/logout", async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE];
    if (token) {
      const db = getDb();
      await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
    }
    clearSessionCookie(reply);
    return reply.send({ ok: true });
  });

  app.get(
    "/api/auth/me",
    {
      preHandler: requireAuth,
    },
    async (request, reply) => {
      if (!request.user) return reply.code(401).send({ error: "Unauthorized" });
      return { user: request.user };
    },
  );
}
