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
app.post("/readings", (req, res) => {
  const { metric, value, unit } = req.body ?? {};

  if (typeof metric !== "string" || metric.length === 0) {
    res.status(400).json({ error: "metric (non-empty string) is required" });
    return;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    res.status(400).json({ error: "value (number) is required" });
    return;
  }
  if (unit !== undefined && typeof unit !== "string") {
    res.status(400).json({ error: "unit must be a string if provided" });
    return;
  }

  const reading = createReading({ metric, value, unit });
  res.status(201).json(reading);
});

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`🚀 GraphQL server ready at http://localhost:${port}/graphql`);
  console.log(`🔌 GraphQL subscriptions ready at ws://localhost:${port}/graphql`);
  console.log(`📡 Device ingest endpoint ready at http://localhost:${port}/readings`);
});
