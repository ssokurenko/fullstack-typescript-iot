/**
 * Dev-only mock device: simulates a greenhouse sensor pushing readings to the
 * server's REST ingest endpoint (POST /readings). Not part of the app runtime.
 */

import {
  ANOMALY_DEVIATION_PCT,
  ANOMALY_EVERY_NTH_READING,
  METRIC_RANGES,
  NORMAL_DEVIATION_PCT,
  type MetricKey,
} from "@iot/shared";
import { TARGET_URL, UPDATE_INTERVAL_MS } from "./config";

// The last known-normal value per metric. Anomaly spikes are computed from
// this but never written back to it, so the reading right after an anomaly
// naturally resumes a normal 1-2% step from the pre-anomaly value.
const lastNormalValue: Record<MetricKey, number> = Object.fromEntries(
  METRIC_RANGES.map((metric) => [metric.key, metric.baseline]),
) as Record<MetricKey, number>;

function randomInRange([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

function randomSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function deviate(value: number, pctRange: [number, number]): number {
  const pct = randomInRange(pctRange) * randomSign();
  return value * (1 + pct / 100);
}

let readingCount = 0;

function generateReading(): { reading: Record<MetricKey, number>; anomalyKey: MetricKey | null } {
  readingCount += 1;
  const isAnomalyReading = readingCount % ANOMALY_EVERY_NTH_READING === 0;
  const anomalyKey = isAnomalyReading
    ? METRIC_RANGES[Math.floor(Math.random() * METRIC_RANGES.length)]!.key
    : null;

  const reading = {} as Record<MetricKey, number>;

  for (const metric of METRIC_RANGES) {
    if (metric.key === anomalyKey) {
      const spike = clamp(
        deviate(lastNormalValue[metric.key], ANOMALY_DEVIATION_PCT),
        metric.hardMin,
        metric.hardMax,
      );
      reading[metric.key] = round(spike, metric.decimals);
      // lastNormalValue intentionally left untouched
    } else {
      const next = clamp(
        deviate(lastNormalValue[metric.key], NORMAL_DEVIATION_PCT),
        metric.min,
        metric.max,
      );
      lastNormalValue[metric.key] = next;
      reading[metric.key] = round(next, metric.decimals);
    }
  }

  return { reading, anomalyKey };
}

async function tick(): Promise<void> {
  const { reading, anomalyKey } = generateReading();

  try {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reading),
    });
    const anomalyNote = anomalyKey ? ` [anomaly: ${anomalyKey}]` : "";
    console.log(
      `[mock-device] #${readingCount} -> ${response.status}${anomalyNote}`,
      reading,
    );
  } catch (error) {
    console.error("[mock-device] failed to post reading:", error);
  }
}

console.log(
  `[mock-device] posting mock readings to ${TARGET_URL} every ${UPDATE_INTERVAL_MS}ms`,
);
void tick();
setInterval(tick, UPDATE_INTERVAL_MS);
