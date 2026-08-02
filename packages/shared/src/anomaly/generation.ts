import type { MetricKey } from "../types";

export interface MetricRange {
  key: MetricKey;
  baseline: number;
  /** plausible operating band; normal readings are kept within this */
  min: number;
  max: number;
  /** physically-possible band; anomaly spikes are clamped to this instead */
  hardMin: number;
  hardMax: number;
  decimals: number;
}

export const METRIC_RANGES: MetricRange[] = [
  { key: "temp", baseline: 22, min: 18, max: 30, hardMin: 0, hardMax: 45, decimals: 1 },
  { key: "humidity", baseline: 55, min: 40, max: 80, hardMin: 0, hardMax: 100, decimals: 1 },
  { key: "soilMoisture", baseline: 40, min: 25, max: 60, hardMin: 0, hardMax: 100, decimals: 1 },
  { key: "co2", baseline: 800, min: 400, max: 1200, hardMin: 300, hardMax: 3000, decimals: 0 },
];

/** Normal-reading deviation range, as a percentage of the previous value. */
export const NORMAL_DEVIATION_PCT: [number, number] = [0.2, 0.5];

/** Anomaly-reading deviation range, as a percentage of the previous value. */
export const ANOMALY_DEVIATION_PCT: [number, number] = [10, 25];

/** One anomaly is injected every Nth generated reading. */
export const ANOMALY_EVERY_NTH_READING = 6;
