import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as StoreModule from "./store";

const READING = { temp: 22, humidity: 55, soilMoisture: 40, co2: 800 };

// store.ts keeps its readings/anomalies in module-level state, so each test
// gets a fresh module instance rather than leaking data between tests.
let store: typeof StoreModule;

beforeEach(async () => {
  vi.resetModules();
  store = await import("./store");
});

describe("createReading", () => {
  it("assigns an incrementing sequence number to each reading", () => {
    const first = store.createReading(READING);
    const second = store.createReading(READING);

    expect(first.seq).toBe(1);
    expect(second.seq).toBe(2);
  });

  it("returns the input values plus a generated id and timestamp", () => {
    const reading = store.createReading(READING);

    expect(reading).toMatchObject(READING);
    expect(reading.id).toEqual(expect.any(String));
    expect(reading.timestamp).toEqual(expect.any(String));
  });
});

describe("listReadings", () => {
  it("keeps only the most recent 80 readings once the cap is exceeded", () => {
    for (let i = 0; i < 85; i++) {
      store.createReading(READING);
    }

    const readings = store.listReadings();

    expect(readings).toHaveLength(80);
    expect(readings[0]?.seq).toBe(6);
    expect(readings.at(-1)?.seq).toBe(85);
  });

  it("respects an explicit limit", () => {
    for (let i = 0; i < 10; i++) {
      store.createReading(READING);
    }

    expect(store.listReadings(3)).toHaveLength(3);
    expect(store.listReadings(3).at(-1)?.seq).toBe(10);
  });
});

describe("anomaly detection", () => {
  it("flags a clear outlier once there is enough history", () => {
    for (let i = 0; i < 6; i++) {
      store.createReading(READING);
    }
    store.createReading({ ...READING, co2: 50_000 });

    const anomalies = store.listAnomalies();

    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]?.metric).toBe("co2");
    expect(anomalies[0]?.value).toBe(50_000);
  });

  it("does not flag anything before there is enough history", () => {
    store.createReading({ ...READING, co2: 50_000 });

    expect(store.listAnomalies()).toHaveLength(0);
  });
});
