import { gql } from "@apollo/client";

export const READING_ADDED_SUBSCRIPTION = gql`
  subscription OnReadingAdded {
    readingAdded {
      id
      temp
      humidity
      soilMoisture
      co2
      timestamp
    }
  }
`;
