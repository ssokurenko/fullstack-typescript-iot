import { detectReadingAnomalies, type AnomalyRecord, type GreenhouseReading } from "@iot/shared";
import { ANOMALY_DETECTED, pubsub, READING_ADDED } from "./pubsub";

const MAX_READINGS = 80;
const MAX_ANOMALIES = 10;

const readings: GreenhouseReading[] = [];
const anomalies: AnomalyRecord[] = [];

let nextSeq = 1;

export function listReadings(limit?: number | null): GreenhouseReading[] {
  return limit != null ? readings.slice(-limit) : readings;
}

export function listAnomalies(): AnomalyRecord[] {
  return anomalies;
}

export function createReading(input: {
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
}): GreenhouseReading {
  const reading: GreenhouseReading = {
    id: crypto.randomUUID(),
    seq: nextSeq++,
    temp: input.temp,
    humidity: input.humidity,
    soilMoisture: input.soilMoisture,
    co2: input.co2,
    timestamp: new Date().toISOString(),
  };

  const history = readings.slice();
  readings.push(reading);
  if (readings.length > MAX_READINGS) {
    readings.splice(0, readings.length - MAX_READINGS);
  }
  void pubsub.publish(READING_ADDED, { readingAdded: reading });

  for (const detected of detectReadingAnomalies(reading, history)) {
    const record: AnomalyRecord = {
      id: crypto.randomUUID(),
      seq: reading.seq,
      metric: detected.metric,
      value: detected.value,
      zScore: detected.zScore,
      timestamp: reading.timestamp,
    };
    anomalies.push(record);
    if (anomalies.length > MAX_ANOMALIES) {
      anomalies.splice(0, anomalies.length - MAX_ANOMALIES);
    }
    void pubsub.publish(ANOMALY_DETECTED, { anomalyDetected: record });
  }

  return reading;
}
