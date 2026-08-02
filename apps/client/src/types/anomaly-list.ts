import type { AnomalyRecord } from "@iot/shared";

export interface AnomalyListProps {
  anomalies: AnomalyRecord[];
  /** id of the currently selected anomaly, for row highlighting */
  selectedAnomalyId?: string | undefined;
  onSelect?: (anomaly: AnomalyRecord) => void;
}
