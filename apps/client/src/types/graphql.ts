import type { AnomalyRecord, GreenhouseReading } from "@iot/shared";

export interface ReadingsData {
  readings: GreenhouseReading[];
}

export interface ReadingAddedData {
  readingAdded: GreenhouseReading;
}

export interface AnomaliesData {
  anomalies: AnomalyRecord[];
}

export interface AnomalyDetectedData {
  anomalyDetected: AnomalyRecord;
}
