import type { GreenhouseReading, MetricKey } from "@iot/shared";

export interface ReadingsChartProps {
  readings: GreenhouseReading[];
  metric: MetricKey;
  /** sequence number of a reading to highlight (e.g. a selected anomaly) */
  highlightSeq?: number | undefined;
}
