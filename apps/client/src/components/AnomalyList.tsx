import { Droplets, Sprout, Thermometer, Wind } from "lucide-react";
import type { MetricKey } from "@iot/shared";
import type { AnomalyListProps } from "../types/anomaly-list";

const METRIC_META: Record<MetricKey, { label: string; unit: string; icon: typeof Thermometer }> = {
  temp: { label: "Temperature", unit: "°C", icon: Thermometer },
  humidity: { label: "Humidity", unit: "%", icon: Droplets },
  soilMoisture: { label: "Soil Moisture", unit: "%", icon: Sprout },
  co2: { label: "CO2", unit: "ppm", icon: Wind },
};

export function AnomalyList({ anomalies, selectedAnomalyId, onSelect }: AnomalyListProps) {
  if (anomalies.length === 0) {
    return <p className="text-base-content/60">No anomalies detected.</p>;
  }

  const newestFirst = [...anomalies].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );

  return (
    <ul className="list">
      {newestFirst.map((anomaly) => {
        const { label, unit, icon: Icon } = METRIC_META[anomaly.metric];
        const isSelected = anomaly.id === selectedAnomalyId;
        return (
          <li
            key={anomaly.id}
            className={`list-row items-center rounded-box border px-2 transition-colors ${
              onSelect ? "cursor-pointer" : ""
            } ${isSelected ? "border-base-300 bg-base-200" : "border-transparent"}`}
            onClick={() => onSelect?.(anomaly)}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onKeyDown={
              onSelect
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(anomaly);
                    }
                  }
                : undefined
            }
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-box bg-base-200">
              <Icon className="h-5 w-5 text-base-content/70" />
            </div>
            <div className="list-col-grow">
              <div className="font-medium">{label}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Reading #{anomaly.seq} · {anomaly.value}
                {unit} · z-score {anomaly.zScore.toFixed(2)}
              </div>
            </div>
            <div className="text-xs opacity-50 mr-5 whitespace-nowrap">
              {new Date(anomaly.timestamp).toLocaleTimeString()}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
