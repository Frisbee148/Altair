import http from "node:http";
import { WebSocketServer } from "ws";
import { env } from "@altair/config";
import { createLogger } from "@altair/logger";
import type { HealthResponse } from "@altair/types";

const log = createLogger("collaboration");

export function start() {
  const { COLLAB_PORT } = env();

  const health: HealthResponse = {
    ok: true,
    service: "collaboration",
    timestamp: new Date().toISOString(),
  };

  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(health));
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "WELCOME", phase: 1, message: "Yjs rooms land in Phase 7" }));
    socket.on("message", (data) => {
      log.debug({ data: data.toString() }, "ws message (stub)");
    });
  });

  server.listen(COLLAB_PORT, "0.0.0.0", () => {
    log.info({ port: COLLAB_PORT }, "Collaboration server listening");
  });
}

start();
