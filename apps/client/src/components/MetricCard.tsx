import type { MetricCardProps } from "../types/metric-card";

export function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-sm font-medium uppercase tracking-wide text-base-content/60">
          {label}
        </h2>
        <p className="text-4xl font-bold">
          {value ?? "—"}
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
