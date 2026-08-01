import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import type { MetricCardProps } from "../types/metric-card";

export function MetricCard({
  label,
  value,
  unit,
  decimals = 0,
  isAnomaly = false,
}: MetricCardProps) {
  const animated = useAnimatedNumber(value);

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-sm font-medium uppercase tracking-wide text-base-content/60">
          {label}
        </h2>
        <p
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
