import { expect, test } from "@playwright/test";
import { openDashboard } from "./helpers";

test.describe("Dashboard", () => {
  test("loads with header, live status, and all four metric cards", async ({
    page,
  }) => {
    await openDashboard(page);

    await expect(page.getByAltText(/logo/i)).toBeVisible();
    await expect(page.getByText("IoT Monitoring Dashboard")).toBeVisible();

    for (const key of ["temperature", "humidity", "soil-moisture", "co2"]) {
      await expect(page.getByTestId(`metric-card-${key}`)).toBeVisible();
    }
  });

  test("defaults to the Temperature chart with an Anomalies panel", async ({
    page,
  }) => {
    await openDashboard(page);

    // Not getByText: "No anomalies detected." (shown when the list is
    // empty) contains "anomalies" too and would make this ambiguous.
    await expect(page.getByRole("heading", { name: "Anomalies" })).toBeVisible();
    await expect(page.getByTestId("chart-title")).toHaveText(
      "Temperature Timeseries",
    );
  });
});
