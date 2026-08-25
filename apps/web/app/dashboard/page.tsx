"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { StatusPanel } from "@/components/StatusPanel";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

function DashboardInner() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Phase 2 — Auth</p>
          <h1 className="text-4xl font-semibold tracking-tight">Welcome, {user?.username}</h1>
          <p className="text-[var(--muted)]">{user?.email}</p>
        </div>
        <button
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          Log out
        </button>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
        <h2 className="mb-2 text-base font-medium text-[var(--text)]">You are signed in</h2>
        <p>
          Protected route works via httpOnly session cookie. Next up: Phase 3 — create collaborative
          projects.
        </p>
      </section>

      <StatusPanel />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}
