import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Phase 2 — Auth</p>
        <h1 className="text-3xl font-semibold">Sign in to Altair</h1>
        <p className="text-sm text-[var(--muted)]">Session cookies stay httpOnly; JWTs are short-lived.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6">
        <LoginForm />
      </div>
    </main>
  );
}
