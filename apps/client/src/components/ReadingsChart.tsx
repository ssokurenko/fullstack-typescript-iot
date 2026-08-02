import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { MetricKey } from "@iot/shared";
import type { ReadingsChartProps } from "../types/readings-chart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const METRIC_META: Record<MetricKey, { label: string; unit: string; color: string }> = {
  temp: { label: "Temperature", unit: "°C", color: "#f97316" },
  humidity: { label: "Humidity", unit: "%", color: "#0ea5e9" },
  soilMoisture: { label: "Soil Moisture", unit: "%", color: "#22c55e" },
  co2: { label: "CO2", unit: "ppm", color: "#a855f7" },
};

const AXIS_COLOR = "rgba(128, 128, 128, 0.8)";
const GRID_COLOR = "rgba(128, 128, 128, 0.15)";
const HIGHLIGHT_COLOR = "#ef4444";

export function ReadingsChart({ readings, metric, highlightSeq }: ReadingsChartProps) {
  if (readings.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-base-content/50">
        No readings yet.
      </div>
    );
  }

  const { label, unit, color } = METRIC_META[metric];
  const isHighlighted = (seq: number) => highlightSeq != null && seq === highlightSeq;

  return (
    <Line
      data={{
        labels: readings.map((reading) => reading.seq),
        datasets: [
          {
            label: `${label} (${unit})`,
            data: readings.map((reading) => reading[metric]),
            borderColor: color,
            backgroundColor: color,
            tension: 0.3,
            pointRadius: readings.map((reading) => (isHighlighted(reading.seq) ? 7 : 2)),
            pointHoverRadius: readings.map((reading) => (isHighlighted(reading.seq) ? 9 : 4)),
            pointBackgroundColor: readings.map((reading) =>
              isHighlighted(reading.seq) ? HIGHLIGHT_COLOR : color,
            ),
            pointBorderColor: readings.map((reading) =>
              isHighlighted(reading.seq) ? HIGHLIGHT_COLOR : color,
            ),
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: "Reading #", color: AXIS_COLOR },
            ticks: { color: AXIS_COLOR },
            grid: { color: GRID_COLOR },
          },
          y: {
            title: { display: true, text: unit, color: AXIS_COLOR },
            ticks: { color: AXIS_COLOR },
            grid: { color: GRID_COLOR },
          },
        },
      }}
    />
  );
}
