"use client";

import { useEffect, useState } from "react";
import type { HealthResponse } from "@altair/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:3002";

function StatusCard({ title, data }: { title: string; data: HealthResponse | null; error?: string }) {
  const ok = data?.ok;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{
            background: ok ? "color-mix(in srgb, var(--ok) 20%, transparent)" : "color-mix(in srgb, var(--bad) 20%, transparent)",
            color: ok ? "var(--ok)" : "var(--bad)",
          }}
        >
          {data ? (ok ? "OK" : "DEGRADED") : "…"}
        </span>
      </div>
      {data ? (
        <pre className="overflow-x-auto text-xs text-[var(--muted)]">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p className="text-sm text-[var(--bad)]">Could not reach service</p>
      )}
    </div>
  );
}

export function StatusPanel() {
  const [api, setApi] = useState<HealthResponse | null>(null);
  const [collab, setCollab] = useState<HealthResponse | null>(null);
  const [wsOk, setWsOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((r) => r.json())
      .then(setApi)
      .catch(() => setApi(null));

    fetch(COLLAB_URL.replace(/^ws/, "http"))
      .then((r) => r.json())
      .then(setCollab)
      .catch(() => setCollab(null));

    const ws = new WebSocket(COLLAB_URL);
    ws.onopen = () => {
      setWsOk(true);
      ws.close();
    };
    ws.onerror = () => setWsOk(false);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatusCard title="API (Fastify + Postgres + Redis)" data={api} />
      <StatusCard title="Collaboration HTTP" data={collab} />
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 md:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Collaboration WebSocket</h3>
          <span className="text-sm" style={{ color: wsOk ? "var(--ok)" : wsOk === false ? "var(--bad)" : "var(--muted)" }}>
            {wsOk === null ? "connecting…" : wsOk ? "connected" : "failed"}
          </span>
        </div>
      </div>
    </div>
  );
}
