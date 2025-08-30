import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "./lib/logger";
import folderRoute from "./modules/folder/folder.route";
import fileRoute from "./modules/file/file.route";

const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .use(
  swagger({
    path: "/docs",
    theme: "default",
    documentation: {
      info: {
        title: "Windows Explorer API",
        version: "1.0.0",
        description: "API for folder & file explorer backend",
      },
    },
  })
)


  .state("logger", logger)
  .group("/api/v1", (app) => 
    app
      .use(folderRoute)
      .use(fileRoute)
    )

app.listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
