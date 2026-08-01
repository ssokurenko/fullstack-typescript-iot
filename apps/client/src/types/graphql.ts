import type { GreenhouseReading } from "@iot/shared";

export interface ReadingsData {
  readings: GreenhouseReading[];
}

export interface ReadingAddedData {
  readingAdded: GreenhouseReading;
}
