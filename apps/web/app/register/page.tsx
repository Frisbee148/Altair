import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Phase 2 — Auth</p>
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="text-sm text-[var(--muted)]">Argon2id password hashing, sessions stored in Postgres.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6">
        <RegisterForm />
      </div>
    </main>
  );
}
