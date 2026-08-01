import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import type { AnomalyRecord } from "@iot/shared";
import { ANOMALIES_QUERY } from "../gql/queries";
import { ANOMALY_DETECTED_SUBSCRIPTION } from "../gql/subscriptions";
import type { AnomaliesData, AnomalyDetectedData } from "../types/graphql";

const MAX_DISPLAYED_ANOMALIES = 10;

/**
 * Reflects the server's anomaly feed: an initial query for the last 10
 * detected anomalies, kept live via subscription. Detection itself runs on
 * the server (see @iot/shared's anomaly/detection.ts), not here.
 */
export function useAnomalies(): AnomalyRecord[] {
  const { data, subscribeToMore } = useQuery<AnomaliesData>(ANOMALIES_QUERY);

  useEffect(() => {
    return subscribeToMore<AnomalyDetectedData>({
      document: ANOMALY_DETECTED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const next = [...prev.anomalies, subscriptionData.data.anomalyDetected];
        return { anomalies: next.slice(-MAX_DISPLAYED_ANOMALIES) };
      },
    });
  }, [subscribeToMore]);

  return data?.anomalies ?? [];
}
