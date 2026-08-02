import { gql } from "@apollo/client";

export const READINGS_QUERY = gql`
  query Readings {
    readings {
      id
      seq
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
      seq
      metric
      value
      zScore
      timestamp
    }
  }
`;
