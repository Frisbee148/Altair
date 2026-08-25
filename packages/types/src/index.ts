export type ProjectRole = "OWNER" | "EDITOR" | "VIEWER";

export interface CursorPosition {
  line: number;
  column: number;
}

export interface Selection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface Presence {
  userId: string;
  name: string;
  color: string;
  cursor?: CursorPosition;
  selection?: Selection;
  status: "active" | "idle";
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  postgres?: boolean;
  redis?: boolean;
  timestamp: string;
}
