import { useSyncExternalStore } from "react";
import {
  getConnectionStatus,
  subscribeConnectionStatus,
} from "../utils/connection-status";

const STATUS_STYLES = {
  online: { dot: "bg-success", label: "Online", pulse: true },
  offline: { dot: "bg-error", label: "Offline", pulse: false },
} as const;

export function LiveIndicator() {
  const status = useSyncExternalStore(
    subscribeConnectionStatus,
    getConnectionStatus,
  );
  const { dot, label, pulse } = STATUS_STYLES[status];

  return (
    <div
      data-testid="connection-status"
      data-status={status}
      className="flex items-center gap-2 text-sm text-base-content/70"
    >
      <span className="relative flex h-4 w-4">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dot}`}
          ></span>
        )}
        <span
          className={`relative inline-flex h-4 w-4 rounded-full ${dot}`}
        ></span>
      </span>
      {label}
    </div>
  );
}
