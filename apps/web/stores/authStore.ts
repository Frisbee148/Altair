import type { AuthResponse, PublicUser } from "@altair/types";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return data;
}

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  loading: boolean;
  hydrated: boolean;
  setSession: (user: PublicUser, accessToken: string) => void;
  clear: () => void;
  hydrate: () => Promise<void>;
  register: (input: { email: string; username: string; password: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  loading: false,
  hydrated: false,

  setSession: (user, accessToken) => set({ user, accessToken }),

  clear: () => set({ user: null, accessToken: null }),

  hydrate: async () => {
    try {
      const data = await api<{ user: PublicUser }>("/api/auth/me");
      set({ user: data.user, hydrated: true });
    } catch {
      set({ user: null, accessToken: null, hydrated: true });
    }
  },

  register: async (input) => {
    set({ loading: true });
    try {
      const data = await api<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      get().setSession(data.user, data.accessToken);
    } finally {
      set({ loading: false });
    }
  },

  login: async (input) => {
    set({ loading: true });
    try {
      const data = await api<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      get().setSession(data.user, data.accessToken);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      get().clear();
    }
  },
}));
