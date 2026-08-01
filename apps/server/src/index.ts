import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs } from "@iot/shared";
import { resolvers } from "./resolvers";
import { createReading } from "./store";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

// GraphQL subscriptions transport, sharing the same schema and HTTP server.
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
await server.start();

app.use(cors());
app.use(express.json());
app.use("/graphql", expressMiddleware(server));

// Plain REST ingest endpoint for external devices that can't speak GraphQL.
// Every reading posted here is broadcast to subscribers over the `readingAdded` subscription.
const REQUIRED_FIELDS = ["temp", "humidity", "soilMoisture", "co2"] as const;

app.post("/readings", (req, res) => {
  const body = req.body ?? {};

  for (const field of REQUIRED_FIELDS) {
    if (typeof body[field] !== "number" || Number.isNaN(body[field])) {
      res.status(400).json({ error: `${field} (number) is required` });
      return;
    }
  }

  const reading = createReading({
    temp: body.temp,
    humidity: body.humidity,
    soilMoisture: body.soilMoisture,
    co2: body.co2,
  });
  res.status(201).json(reading);
});

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`🚀 GraphQL server ready at http://localhost:${port}/graphql`);
  console.log(`🔌 GraphQL subscriptions ready at ws://localhost:${port}/graphql`);
  console.log(`📡 Device ingest endpoint ready at http://localhost:${port}/readings`);
});
