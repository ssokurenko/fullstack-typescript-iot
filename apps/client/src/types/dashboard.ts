import type { ApolloError } from "@apollo/client";
import type { GreenhouseReading } from "@iot/shared";

export interface UseDashboardResult {
  readings: GreenhouseReading[];
  latest: GreenhouseReading | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}
