import { StatusPanel } from "@/components/StatusPanel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Phase 1 — Foundation</p>
        <h1 className="text-4xl font-semibold tracking-tight">Altair</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Real-time collaborative IDE — Monaco, Yjs, Fastify, PostgreSQL, Redis. This page confirms all
          foundation services boot together.
        </p>
      </header>

      <StatusPanel />

      <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
        <h2 className="mb-3 text-base font-medium text-[var(--text)]">Next phases (from plan.md)</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Phase 2 — Authentication</li>
          <li>Phase 3 — Project management</li>
          <li>Phase 4 — File system</li>
          <li>Phase 5 — Monaco editor</li>
          <li>Phase 7 — Yjs collaboration</li>
        </ol>
      </section>
    </main>
  );
}
