import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { READINGS_QUERY } from "../gql/queries";
import { READING_ADDED_SUBSCRIPTION } from "../gql/subscriptions";
import type { ReadingAddedData, ReadingsData } from "../types/graphql";
import type { UseDashboardResult } from "../types/dashboard";

const MAX_READINGS = 80;

export function useDashboard(): UseDashboardResult {
  const { data, loading, error, subscribeToMore } =
    useQuery<ReadingsData>(READINGS_QUERY);

  useEffect(() => {
    return subscribeToMore<ReadingAddedData>({
      document: READING_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const next = [...prev.readings, subscriptionData.data.readingAdded];
        return { readings: next.slice(-MAX_READINGS) };
      },
    });
  }, [subscribeToMore]);

  const readings = (data?.readings ?? []).slice(-MAX_READINGS);

  return {
    readings,
    latest: readings.at(-1),
    loading,
    error,
  };
}
