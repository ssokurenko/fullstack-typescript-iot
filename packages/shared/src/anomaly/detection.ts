import type { GreenhouseReading, MetricKey } from "../types";

/** How many trailing readings to score a new value against. */
export const ANOMALY_WINDOW_SIZE = 20;

/** Minimum history required before scoring; too little history is unreliable. */
export const ANOMALY_MIN_SAMPLES = 5;

/** Modified z-scores beyond this magnitude are flagged as anomalous. */
export const ANOMALY_Z_SCORE_THRESHOLD = 3.5;

/**
 * Reported in place of an infinite z-score (a flatlined window — MAD of 0 —
 * followed by any change at all). Kept finite so it survives GraphQL's
 * `Float!` serialization, which rejects Infinity/NaN.
 */
const FLATLINE_Z_SCORE = 999;

const METRIC_KEYS: MetricKey[] = ["temp", "humidity", "soilMoisture", "co2"];

export interface MetricAnomaly {
  metric: MetricKey;
  value: number;
  zScore: number;
  windowMedian: number;
  windowMad: number;
}

/** A detected anomaly as recorded/transmitted (e.g. over GraphQL). */
export interface AnomalyRecord {
  id: string;
  /** sequence number of the reading that triggered this anomaly */
  seq: number;
  metric: MetricKey;
  value: number;
  zScore: number;
  timestamp: string;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

/**
 * Modified (robust) z-score: scores `value` against the median and median
 * absolute deviation (MAD) of `window`, instead of the mean and standard
 * deviation a classic z-score would use. Mean/stdDev are themselves dragged
 * toward outliers, which blunts a classic z-score's ability to catch the
 * very spikes it's meant to detect; median/MAD stay stable in their
 * presence. The 0.6745 constant scales MAD so it's comparable to a standard
 * deviation for normally-distributed data (the standard convention for this
 * technique, per Iglewicz & Hoaglin).
 */
export function modifiedZScore(
  value: number,
  window: number[],
): { z: number; median: number; mad: number } {
  const windowMedian = median(window);
  const mad = median(window.map((v) => Math.abs(v - windowMedian)));

  if (mad === 0) {
    const z = value === windowMedian ? 0 : Math.sign(value - windowMedian) * FLATLINE_Z_SCORE;
    return { z, median: windowMedian, mad };
  }

  return {
    z: (0.6745 * (value - windowMedian)) / mad,
    median: windowMedian,
    mad,
  };
}

/** Scores a single metric's latest value against its trailing history. */
export function detectMetricAnomaly(
  metric: MetricKey,
  value: number,
  history: number[],
): MetricAnomaly | null {
  if (history.length < ANOMALY_MIN_SAMPLES) return null;

  const window = history.slice(-ANOMALY_WINDOW_SIZE);
  const { z, median: windowMedian, mad } = modifiedZScore(value, window);

  if (Math.abs(z) < ANOMALY_Z_SCORE_THRESHOLD) return null;

  return { metric, value, zScore: z, windowMedian, windowMad: mad };
}

/**
 * Scores every metric on `latest` against `history` (readings strictly
 * before `latest`, oldest first) and returns any that came back anomalous.
 */
export function detectReadingAnomalies(
  latest: GreenhouseReading,
  history: GreenhouseReading[],
): MetricAnomaly[] {
  const anomalies: MetricAnomaly[] = [];

  for (const metric of METRIC_KEYS) {
    const anomaly = detectMetricAnomaly(
      metric,
      latest[metric],
      history.map((reading) => reading[metric]),
    );
    if (anomaly) anomalies.push(anomaly);
  }

  return anomalies;
}
