import { gql } from "@apollo/client";

export const READINGS_QUERY = gql`
  query Readings {
    readings {
      id
      temp
      humidity
      soilMoisture
      co2
      timestamp
    }
  }
`;

export const ANOMALIES_QUERY = gql`
  query Anomalies {
    anomalies {
      id
      metric
      value
      zScore
      timestamp
    }
  }
`;
