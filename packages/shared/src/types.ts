export interface GreenhouseReading {
  id: string;
  /** server-assigned monotonic sequence number, for ordering/charting */
  seq: number;
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
  timestamp: string;
}

export type MetricKey = Exclude<keyof GreenhouseReading, "id" | "seq" | "timestamp">;
