import { expect, test } from "@playwright/test";
import { openDashboard, postReading } from "./helpers";

test.describe("Live readings", () => {
  test("a reading posted over REST appears on the dashboard via the live subscription", async ({
    page,
    request,
  }) => {
    await openDashboard(page);

    const reading = { temp: 26.4, humidity: 61.2, soilMoisture: 44.8, co2: 812 };
    await postReading(request, reading);

    await expect(
      page.getByTestId("metric-card-temperature").getByTestId("metric-value"),
    ).toHaveText(/26\.4/, { timeout: 10_000 });
    await expect(
      page.getByTestId("metric-card-humidity").getByTestId("metric-value"),
    ).toHaveText(/61\.2/);
    await expect(
      page.getByTestId("metric-card-soil-moisture").getByTestId("metric-value"),
    ).toHaveText(/44\.8/);
    await expect(
      page.getByTestId("metric-card-co2").getByTestId("metric-value"),
    ).toHaveText(/812/);
  });

  test("clicking a metric card selects it and switches the timeseries chart", async ({
    page,
    request,
  }) => {
    await openDashboard(page);
    await postReading(request, {
      temp: 23,
      humidity: 50,
      soilMoisture: 38,
      co2: 790,
    });

    const humidityCard = page.getByTestId("metric-card-humidity");
    await expect(humidityCard).toHaveAttribute("data-selected", "false");

    await humidityCard.click();

    await expect(humidityCard).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("metric-card-temperature")).toHaveAttribute(
      "data-selected",
      "false",
    );
    await expect(page.getByTestId("chart-title")).toHaveText(
      "Humidity Timeseries",
    );
  });
});
