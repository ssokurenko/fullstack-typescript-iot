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
