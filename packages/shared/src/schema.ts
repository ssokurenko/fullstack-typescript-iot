import gql from "graphql-tag";

export const typeDefs = gql`
  type GreenhouseReading {
    id: ID!
    temp: Float!
    humidity: Float!
    soilMoisture: Float!
    co2: Float!
    timestamp: String!
  }

  type Anomaly {
    id: ID!
    metric: String!
    value: Float!
    zScore: Float!
    timestamp: String!
  }

  type Query {
    readings(limit: Int): [GreenhouseReading!]!
    anomalies: [Anomaly!]!
  }

  type Mutation {
    addReading(
      temp: Float!
      humidity: Float!
      soilMoisture: Float!
      co2: Float!
    ): GreenhouseReading!
  }

  type Subscription {
    readingAdded: GreenhouseReading!
    anomalyDetected: Anomaly!
  }
`;
