export interface GreenhouseReading {
  id: string;
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
  timestamp: string;
}

export type MetricKey = Exclude<keyof GreenhouseReading, "id" | "timestamp">;
