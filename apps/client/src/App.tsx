import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import type { GreenhouseReading } from "@iot/shared";

const READINGS_QUERY = gql`
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

const READING_ADDED_SUBSCRIPTION = gql`
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

interface ReadingsData {
  readings: GreenhouseReading[];
}

interface ReadingAddedData {
  readingAdded: GreenhouseReading;
}

function ReadingSummary({ reading }: { reading: GreenhouseReading }) {
  return (
    <>
      temp: {reading.temp} · humidity: {reading.humidity} · soilMoisture:{" "}
      {reading.soilMoisture} · co2: {reading.co2} —{" "}
      {new Date(reading.timestamp).toLocaleString()}
    </>
  );
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

      {!latest && <p>No readings available.</p>}

      {latest && (
        <section>
          <h2>Latest reading</h2>
          <p>
            <ReadingSummary reading={latest} />
          </p>
        </section>
      )}

      <ul>
        {readings.map((reading) => (
          <li key={reading.id}>
            <ReadingSummary reading={reading} />
          </li>
        ))}
      </ul>
    </main>
  );
}
