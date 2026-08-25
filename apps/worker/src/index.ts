import Redis from "ioredis";
import { env } from "@altair/config";
import { createLogger } from "@altair/logger";

const log = createLogger("worker");

async function main() {
  const redis = new Redis(env().REDIS_URL, { maxRetriesPerRequest: null });
  await redis.ping();
  log.info("Worker connected to Redis (BullMQ execution lands in Phase 9)");
  log.info({ port: env().WORKER_PORT }, "Worker ready");

  const shutdown = async () => {
    await redis.quit();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
