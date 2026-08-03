import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as ConnectionStatusModule from "./connection-status";

let connectionStatus: typeof ConnectionStatusModule;

beforeEach(async () => {
  vi.resetModules();
  connectionStatus = await import("./connection-status");
});

describe("connection status store", () => {
  it("starts offline", () => {
    expect(connectionStatus.getConnectionStatus()).toBe("offline");
  });

  it("updates the status and notifies subscribers", () => {
    const listener = vi.fn();
    connectionStatus.subscribeConnectionStatus(listener);

    connectionStatus.setConnectionStatus("online");

    expect(connectionStatus.getConnectionStatus()).toBe("online");
    expect(listener).toHaveBeenCalledWith("online");
  });

  it("does not notify subscribers when the status is unchanged", () => {
    connectionStatus.setConnectionStatus("online");
    const listener = vi.fn();
    connectionStatus.subscribeConnectionStatus(listener);

    connectionStatus.setConnectionStatus("online");

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying a listener after it unsubscribes", () => {
    const listener = vi.fn();
    const unsubscribe = connectionStatus.subscribeConnectionStatus(listener);

    unsubscribe();
    connectionStatus.setConnectionStatus("online");

    expect(listener).not.toHaveBeenCalled();
  });
});
