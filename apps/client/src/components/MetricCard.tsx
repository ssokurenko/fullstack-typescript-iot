import { TriangleAlert } from "lucide-react";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import type { MetricCardProps } from "../types/metric-card";

export function MetricCard({
  label,
  value,
  unit,
  decimals = 0,
  isAnomaly = false,
  isSelected = false,
  onClick,
}: MetricCardProps) {
  const animated = useAnimatedNumber(value);
  const testId = `metric-card-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      data-testid={testId}
      data-selected={isSelected}
      data-anomaly={isAnomaly}
      className={`card shadow-md transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${isSelected ? "bg-base-300" : "bg-base-100"}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="card-body">
        <div className="flex items-center gap-1.5">
          <h2 className="card-title text-sm font-medium uppercase tracking-wide text-base-content/60">
            {label}
          </h2>
          {isAnomaly && <TriangleAlert className="h-4 w-4 text-error" />}
        </div>
        <p
          data-testid="metric-value"
          className={`text-4xl font-bold tabular-nums ${isAnomaly ? "text-error" : ""}`}
        >
          {animated !== undefined ? animated.toFixed(decimals) : "—"}
          {value !== undefined && (
            <span className="ml-1 text-lg font-normal text-base-content/60">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
