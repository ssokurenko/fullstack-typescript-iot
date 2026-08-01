import { createReading, listReadings } from "./store";
import { pubsub, READING_ADDED } from "./pubsub";

export const resolvers = {
  Query: {
    readings: (_: unknown, args: { limit?: number | null }) =>
      listReadings(args.limit),
  },
  Mutation: {
    addReading: (
      _: unknown,
      args: { metric: string; value: number; unit?: string | null },
    ) => createReading(args),
  },
  Subscription: {
    readingAdded: {
      subscribe: () => pubsub.asyncIterableIterator(READING_ADDED),
    },
  },
};
