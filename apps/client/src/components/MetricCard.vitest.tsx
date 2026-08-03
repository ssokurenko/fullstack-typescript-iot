import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders the label, value, and unit", () => {
    render(<MetricCard label="Temperature" value={23.6} unit="°C" decimals={1} />);

    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByTestId("metric-value")).toHaveTextContent("23.6°C");
  });

  it("shows a placeholder when there is no value yet", () => {
    render(<MetricCard label="Temperature" value={undefined} unit="°C" />);

    expect(screen.getByTestId("metric-value")).toHaveTextContent("—");
  });

  it("marks the card as anomalous via data-anomaly", () => {
    render(<MetricCard label="CO2" value={50_000} unit="ppm" isAnomaly />);

    expect(screen.getByTestId("metric-card-co2")).toHaveAttribute(
      "data-anomaly",
      "true",
    );
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<MetricCard label="Humidity" value={55} unit="%" onClick={onClick} />);

    fireEvent.click(screen.getByTestId("metric-card-humidity"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
