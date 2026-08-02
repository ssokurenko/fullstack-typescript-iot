export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Greenhouse Device Ingest API",
    version: "1.0.0",
    description:
      "REST endpoint for external devices to post greenhouse sensor readings. " +
      "For querying readings/anomalies or subscribing to live updates, use the GraphQL API at /graphql instead.",
  },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/readings": {
      post: {
        summary: "Post a greenhouse sensor reading",
        description:
          "Ingests one reading from an external device. The reading is broadcast live over the " +
          "`readingAdded` GraphQL subscription and scored for anomalies (modified z-score); any " +
          "detected anomaly is broadcast over the `anomalyDetected` subscription.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReadingInput" },
              example: { temp: 42, humidity: 42, soilMoisture: 42, co2: 800 },
            },
          },
        },
        responses: {
          "201": {
            description: "Reading accepted and stored",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GreenhouseReading" },
              },
            },
          },
          "400": {
            description: "Invalid payload — a required field is missing or not a number",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ReadingInput: {
        type: "object",
        required: ["temp", "humidity", "soilMoisture", "co2"],
        properties: {
          temp: { type: "number", example: 23.6, description: "Temperature in °C" },
          humidity: { type: "number", example: 55, description: "Relative humidity in %" },
          soilMoisture: { type: "number", example: 38.4, description: "Soil moisture in %" },
          co2: { type: "number", example: 798, description: "CO2 concentration in ppm" },
        },
      },
      GreenhouseReading: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          seq: {
            type: "integer",
            description: "Server-assigned monotonic sequence number",
            example: 42,
          },
          temp: { type: "number" },
          humidity: { type: "number" },
          soilMoisture: { type: "number" },
          co2: { type: "number" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "value (number) is required" },
        },
      },
    },
  },
};
