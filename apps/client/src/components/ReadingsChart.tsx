import {
  CategoryScale,
  Chart as ChartJS,
  type ChartType,
  Legend,
  LinearScale,
  LineElement,
  type Plugin,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { MetricKey } from "@iot/shared";
import type { ReadingsChartProps } from "../types/readings-chart";

const AXIS_COLOR = "rgba(128, 128, 128, 0.8)";
const GRID_COLOR = "rgba(128, 128, 128, 0.15)";
const HIGHLIGHT_COLOR = "#ef4444";

interface HighlightLineOptions {
  seq?: number;
}

declare module "chart.js" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by declaration merging
  interface PluginOptionsByType<TType extends ChartType> {
    highlightLine?: HighlightLineOptions;
  }
}

/** Draws a dashed vertical line through the reading matching `seq`, e.g. a selected anomaly. */
const highlightLinePlugin: Plugin<"line", HighlightLineOptions> = {
  id: "highlightLine",
  afterDraw(chart, _args, pluginOptions) {
    const seq = pluginOptions.seq;
    if (seq == null) return;

    const index = chart.data.labels?.indexOf(seq);
    if (index == null || index < 0) return;

    const xScale = chart.scales.x;
    if (!xScale) return;

    const { top, bottom } = chart.chartArea;
    // getPixelForValue (not getPixelForTick) matches where the point/line
    // vertex for this category is actually rendered, at the band's center.
    const x = xScale.getPixelForValue(index);

    const { ctx } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = HIGHLIGHT_COLOR;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  highlightLinePlugin,
);

const METRIC_META: Record<MetricKey, { label: string; unit: string; color: string }> = {
  temp: { label: "Temperature", unit: "°C", color: "#f97316" },
  humidity: { label: "Humidity", unit: "%", color: "#0ea5e9" },
  soilMoisture: { label: "Soil Moisture", unit: "%", color: "#22c55e" },
  co2: { label: "CO2", unit: "ppm", color: "#a855f7" },
};

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
            pointRadius: 2,
            pointHoverRadius: 4,
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
          highlightLine: { seq: highlightSeq },
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
