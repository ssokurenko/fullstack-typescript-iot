import { expect, test } from "@playwright/test";
import { openDashboard, postReading, seedBaseline } from "./helpers";

test.describe("Anomaly detection", () => {
  test("a clear outlier is flagged on its metric card and listed in the Anomalies panel", async ({
    page,
    request,
  }) => {
    await openDashboard(page);

    // Consistent history so the detector has a window to score against,
    // then a CO2 spike far outside any plausible reading.
    await seedBaseline(request);
    await postReading(request, {
      temp: 22,
      humidity: 55,
      soilMoisture: 40,
      co2: 50_000,
    });

    const co2Card = page.getByTestId("metric-card-co2");
    await expect(co2Card).toHaveAttribute("data-anomaly", "true", {
      timeout: 10_000,
    });
    await expect(co2Card.getByTestId("metric-value")).toHaveText(/50000/);

    const co2AnomalyRow = page
      .locator('[data-testid="anomaly-row"][data-metric="co2"]')
      .first();
    await expect(co2AnomalyRow).toBeVisible();
  });

  test("selecting an anomaly focuses its metric card and chart", async ({
    page,
    request,
  }) => {
    await openDashboard(page);

    await seedBaseline(request);
    await postReading(request, {
      temp: 22,
      humidity: 55,
      soilMoisture: 5,
      co2: 800,
    });

    const soilMoistureAnomalyRow = page
      .locator('[data-testid="anomaly-row"][data-metric="soilMoisture"]')
      .first();
    await expect(soilMoistureAnomalyRow).toBeVisible({ timeout: 10_000 });

    await soilMoistureAnomalyRow.click();

    await expect(soilMoistureAnomalyRow).toHaveAttribute(
      "data-selected",
      "true",
    );
    await expect(page.getByTestId("metric-card-soil-moisture")).toHaveAttribute(
      "data-selected",
      "true",
    );
    await expect(page.getByTestId("chart-title")).toHaveText(
      "Soil Moisture Timeseries",
    );
  });
});
