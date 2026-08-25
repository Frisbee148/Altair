import Link from "next/link";
import { StatusPanel } from "@/components/StatusPanel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Phase 2 — Authentication</p>
        <h1 className="text-4xl font-semibold tracking-tight">Altair</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Real-time collaborative IDE. Register or sign in to reach the protected dashboard.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/register"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#041018]"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
          >
            Sign in
          </Link>
        </div>
      </header>

      <StatusPanel />
    </main>
  );
}
