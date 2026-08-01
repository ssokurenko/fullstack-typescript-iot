import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { READINGS_QUERY } from "../gql/queries";
import { READING_ADDED_SUBSCRIPTION } from "../gql/subscriptions";
import type { ReadingAddedData, ReadingsData } from "../types/graphql";
import type { UseDashboardResult } from "../types/dashboard";

export function useDashboard(): UseDashboardResult {
  const { data, loading, error, subscribeToMore } =
    useQuery<ReadingsData>(READINGS_QUERY);

  useEffect(() => {
    return subscribeToMore<ReadingAddedData>({
      document: READING_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          readings: [...prev.readings, subscriptionData.data.readingAdded],
        };
      },
    });
  }, [subscribeToMore]);

  const readings = data?.readings ?? [];

  return {
    readings,
    latest: readings.at(-1),
    loading,
    error,
  };
}
