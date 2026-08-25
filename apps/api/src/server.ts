import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import Redis from "ioredis";
import { env } from "@altair/config";
import { pingDb } from "@altair/database";
import { createLogger } from "@altair/logger";
import type { HealthResponse } from "@altair/types";
import { attachUser } from "./auth/middleware.js";
import { authRoutes } from "./modules/auth/routes.js";

const log = createLogger("api");

async function pingRedis(url: string): Promise<boolean> {
  const redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    lazyConnect: true,
    enableOfflineQueue: false,
  });
  try {
    await redis.connect();
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  } finally {
    redis.disconnect();
  }
}

async function buildHealth(service: string, checkDeps = false): Promise<HealthResponse> {
  const base: HealthResponse = {
    ok: true,
    service,
    timestamp: new Date().toISOString(),
  };
  if (!checkDeps) return base;
  const [postgres, redis] = await Promise.all([pingDb(), pingRedis(env().REDIS_URL)]);
  return { ...base, ok: postgres && redis, postgres, redis };
}

export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });
  await app.register(cookie);

  app.decorateRequest("user", null);

  app.addHook("preHandler", async (request) => {
    await attachUser(request);
  });

  app.get("/health", async () => buildHealth("api"));
  app.get("/api/health", async () => buildHealth("api", true));

  app.get("/", async () => ({
    name: "Altair API",
    phase: 2,
    docs: "/api/health",
    auth: ["/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/auth/me"],
  }));

  await app.register(authRoutes);

  return app;
}

export async function start() {
  const app = await buildServer();
  const { API_PORT } = env();
  await app.listen({ port: API_PORT, host: "0.0.0.0" });
  log.info({ port: API_PORT }, "API listening");
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
