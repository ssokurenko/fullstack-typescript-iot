import gql from "graphql-tag";

export const typeDefs = gql`
  type GreenhouseReading {
    id: ID!
    metric: String!
    value: Float!
    unit: String
    timestamp: String!
  }

  type Query {
    readings(limit: Int): [GreenhouseReading!]!
  }

  type Mutation {
    addReading(metric: String!, value: Float!, unit: String): GreenhouseReading!
  }

  type Subscription {
    readingAdded: GreenhouseReading!
  }
`;
