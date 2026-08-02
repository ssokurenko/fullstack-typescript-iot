import { useState } from "react";
import type { AnomalyRecord, MetricKey } from "@iot/shared";
import { AnomalyList } from "./AnomalyList";
import { LiveIndicator } from "./LiveIndicator";
import { MetricCard } from "./MetricCard";
import { ReadingsChart } from "./ReadingsChart";
import { ThemeToggle } from "./ThemeToggle";
import { useAnomalies } from "../hooks/useAnomalies";
import { useDashboard } from "../hooks/useDashboard";

const METRIC_LABELS: Record<MetricKey, string> = {
  temp: "Temperature",
  humidity: "Humidity",
  soilMoisture: "Soil Moisture",
  co2: "CO2",
};

export function Dashboard() {
  const { readings, latest, loading, error } = useDashboard();
  const anomalies = useAnomalies();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("temp");
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);

  const latestAnomalousMetrics = new Set(
    anomalies
      .filter((anomaly) => anomaly.timestamp === latest?.timestamp)
      .map((anomaly) => anomaly.metric),
  );

  function selectMetric(metric: MetricKey) {
    setSelectedMetric(metric);
    setSelectedAnomaly(null);
  }

  function selectAnomaly(anomaly: AnomalyRecord) {
    setSelectedMetric(anomaly.metric);
    setSelectedAnomaly(anomaly);
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="navbar-start gap-2">
          <img src="/greenhouse-logo.png" alt="Greenhouse Monitor logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">Greenhouse Monitor</span>
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
              <MetricCard
                label="Temperature"
                value={latest?.temp}
                unit="°C"
                decimals={1}
                isAnomaly={latestAnomalousMetrics.has("temp")}
                isSelected={selectedMetric === "temp"}
                onClick={() => selectMetric("temp")}
              />
              <MetricCard
                label="Humidity"
                value={latest?.humidity}
                unit="%"
                decimals={1}
                isAnomaly={latestAnomalousMetrics.has("humidity")}
                isSelected={selectedMetric === "humidity"}
                onClick={() => selectMetric("humidity")}
              />
              <MetricCard
                label="Soil Moisture"
                value={latest?.soilMoisture}
                unit="%"
                decimals={1}
                isAnomaly={latestAnomalousMetrics.has("soilMoisture")}
                isSelected={selectedMetric === "soilMoisture"}
                onClick={() => selectMetric("soilMoisture")}
              />
              <MetricCard
                label="CO2"
                value={latest?.co2}
                unit="ppm"
                isAnomaly={latestAnomalousMetrics.has("co2")}
                isSelected={selectedMetric === "co2"}
                onClick={() => selectMetric("co2")}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card h-[320px] bg-base-100 shadow-md">
                <div className="card-body flex h-full flex-col overflow-hidden">
                  <h2 className="card-title shrink-0">Anomalies</h2>
                  <div className="flex-1 overflow-y-auto">
                    <AnomalyList
                      anomalies={anomalies}
                      selectedAnomalyId={selectedAnomaly?.id}
                      onSelect={selectAnomaly}
                    />
                  </div>
                </div>
              </div>

              <div className="card h-[320px] bg-base-100 shadow-md">
                <div className="card-body flex h-full flex-col">
                  <h2 className="card-title shrink-0">
                    {METRIC_LABELS[selectedMetric]} Timeseries
                  </h2>
                  <div className="flex-1 overflow-hidden">
                    <ReadingsChart
                      readings={readings}
                      metric={selectedMetric}
                      highlightSeq={selectedAnomaly?.seq}
                    />
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
