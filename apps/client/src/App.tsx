import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import type { GreenhouseReading } from "@iot/shared";

const READINGS_QUERY = gql`
  query Readings {
    readings {
      id
      metric
      value
      unit
      timestamp
    }
  }
`;

const READING_ADDED_SUBSCRIPTION = gql`
  subscription OnReadingAdded {
    readingAdded {
      id
      metric
      value
      unit
      timestamp
    }
  }
`;

interface ReadingsData {
  readings: GreenhouseReading[];
}

interface ReadingAddedData {
  readingAdded: GreenhouseReading;
}

export default function App() {
  const { data, loading, error, subscribeToMore } =
    useQuery<ReadingsData>(READINGS_QUERY);

  useEffect(() => {
    return subscribeToMore<ReadingAddedData>({
      document: READING_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          readings: [...prev.readings, subscriptionData.data.readingAdded],
        };
      },
    });
  }, [subscribeToMore]);

  if (loading) return <p>Loading readings…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const readings = data?.readings ?? [];
  const latest = readings.at(-1);

  return (
    <main>
      <h1>Greenhouse Readings</h1>

      {latest && (
        <section>
          <h2>Latest reading</h2>
          <p>
            {latest.metric}: {latest.value}
            {latest.unit ? ` ${latest.unit}` : ""} —{" "}
            {new Date(latest.timestamp).toLocaleString()}
          </p>
        </section>
      )}

      <ul>
        {readings.map((reading) => (
          <li key={reading.id}>
            {reading.metric}: {reading.value}
            {reading.unit ? ` ${reading.unit}` : ""} —{" "}
            {new Date(reading.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
