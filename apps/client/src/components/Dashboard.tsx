import { LiveIndicator } from "./LiveIndicator";
import { MetricCard } from "./MetricCard";
import { ThemeToggle } from "./ThemeToggle";
import { useDashboard } from "../hooks/useDashboard";

export function Dashboard() {
  const { latest, loading, error } = useDashboard();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="navbar-start">
          <span className="text-lg font-semibold">🌱 Greenhouse Monitor</span>
        </div>
        <div className="navbar-end gap-4">
          <LiveIndicator />
          <ThemeToggle />
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {loading && (
          <span className="loading loading-spinner loading-lg"></span>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error.message}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Temperature" value={latest?.temp} unit="°C" />
              <MetricCard label="Humidity" value={latest?.humidity} unit="%" />
              <MetricCard
                label="Soil Moisture"
                value={latest?.soilMoisture}
                unit="%"
              />
              <MetricCard label="CO2" value={latest?.co2} unit="ppm" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">Anomalies</h2>
                    <p>No anomalies detected yet.</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">Readings over time</h2>
                  <div className="flex h-64 items-center justify-center rounded-box border border-dashed border-base-300 text-base-content/50">
                    Time-series chart coming soon
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
