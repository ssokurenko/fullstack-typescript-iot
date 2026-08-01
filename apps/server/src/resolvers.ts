import { createReading, listAnomalies, listReadings } from "./store";
import { ANOMALY_DETECTED, pubsub, READING_ADDED } from "./pubsub";

export const resolvers = {
  Query: {
    readings: (_: unknown, args: { limit?: number | null }) =>
      listReadings(args.limit),
    anomalies: () => listAnomalies(),
  },
  Mutation: {
    addReading: (
      _: unknown,
      args: { temp: number; humidity: number; soilMoisture: number; co2: number },
    ) => createReading(args),
  },
  Subscription: {
    readingAdded: {
      subscribe: () => pubsub.asyncIterableIterator(READING_ADDED),
    },
    anomalyDetected: {
      subscribe: () => pubsub.asyncIterableIterator(ANOMALY_DETECTED),
    },
  },
};
