import type { ConnectionStatus } from "../types/connection";

type Listener = (status: ConnectionStatus) => void;

let status: ConnectionStatus = "offline";
const listeners = new Set<Listener>();

export function setConnectionStatus(next: ConnectionStatus): void {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener(status));
}

export function getConnectionStatus(): ConnectionStatus {
  return status;
}

export function subscribeConnectionStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
