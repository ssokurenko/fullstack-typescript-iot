import type { GreenhouseReading } from "@iot/shared";
import { pubsub, READING_ADDED } from "./pubsub";

const MAX_READINGS = 100;

const readings: GreenhouseReading[] = [];

export function listReadings(limit?: number | null): GreenhouseReading[] {
  return limit != null ? readings.slice(-limit) : readings;
}

export function createReading(input: {
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
}): GreenhouseReading {
  const reading: GreenhouseReading = {
    id: crypto.randomUUID(),
    temp: input.temp,
    humidity: input.humidity,
    soilMoisture: input.soilMoisture,
    co2: input.co2,
    timestamp: new Date().toISOString(),
  };
  readings.push(reading);
  if (readings.length > MAX_READINGS) {
    readings.splice(0, readings.length - MAX_READINGS);
  }
  void pubsub.publish(READING_ADDED, { readingAdded: reading });
  return reading;
}
