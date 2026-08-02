import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi-spec";

export function startSwaggerServer(port: number): void {
  const app = express();
  app.use(cors());
  app.get("/openapi.json", (_req, res) => res.json(openApiSpec));
  app.use("/", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.listen(port, () => {
    console.log(`📘 Swagger docs ready at http://localhost:${port}/`);
  });
}
