import type { GreenhouseReading } from "@iot/shared";
import { pubsub, READING_ADDED } from "./pubsub";

const readings: GreenhouseReading[] = [];

export function listReadings(limit?: number | null): GreenhouseReading[] {
  return limit != null ? readings.slice(-limit) : readings;
}

export function createReading(input: {
  metric: string;
  value: number;
  unit?: string | null;
}): GreenhouseReading {
  const reading: GreenhouseReading = {
    id: crypto.randomUUID(),
    metric: input.metric,
    value: input.value,
    unit: input.unit ?? null,
    timestamp: new Date().toISOString(),
  };
  readings.push(reading);
  void pubsub.publish(READING_ADDED, { readingAdded: reading });
  return reading;
}
