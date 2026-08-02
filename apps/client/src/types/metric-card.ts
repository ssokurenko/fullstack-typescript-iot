export interface MetricCardProps {
  label: string;
  value: number | undefined;
  unit: string;
  /** fixed decimal places to render, so the display width doesn't jump between readings */
  decimals?: number;
  /** highlights the value in red when this metric is currently anomalous */
  isAnomaly?: boolean;
  /** shows a subtle background highlight when this card is the selected one */
  isSelected?: boolean;
  onClick?: () => void;
}
