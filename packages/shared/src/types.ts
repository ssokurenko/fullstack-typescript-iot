export interface GreenhouseReading {
  id: string;
  metric: string;
  value: number;
  unit: string | null;
  timestamp: string;
}
