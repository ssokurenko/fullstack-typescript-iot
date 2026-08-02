import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { SERVER_URL } from "../playwright.config";

/**
 * Navigates to the dashboard and waits for its GraphQL subscription (over
 * WebSocket) to actually connect before returning. Our in-memory PubSub
 * doesn't buffer/replay events for late subscribers - posting a reading or
 * anomaly before the subscription is live means the client silently misses
 * it, so every test that expects to observe a live update must wait here
 * first rather than posting immediately after a bare `page.goto`.
 */
export async function openDashboard(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByTestId("connection-status")).toHaveAttribute(
    "data-status",
    "online",
    { timeout: 15_000 },
  );
}

export interface ReadingInput {
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
}

export const BASELINE_READING: ReadingInput = {
  temp: 22,
  humidity: 55,
  soilMoisture: 40,
  co2: 800,
};

export async function postReading(
  request: APIRequestContext,
  reading: ReadingInput,
): Promise<{ id: string; seq: number }> {
  const response = await request.post(`${SERVER_URL}/readings`, {
    data: reading,
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to post reading: ${response.status()} ${await response.text()}`,
    );
  }
  return response.json();
}

/**
 * The anomaly detector needs a trailing window of consistent history before
 * it will score anything (min. 5 samples) - post enough baseline readings so
 * a subsequent spike is guaranteed to register as anomalous, regardless of
 * whatever state the server already had.
 */
export async function seedBaseline(
  request: APIRequestContext,
  count = 6,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    await postReading(request, BASELINE_READING);
  }
}
