import { FileController } from "./file.controller";
import { Elysia, t } from "elysia";
import type { FileDTO } from "./file.types";

export default (app: Elysia) =>
  app.group("/files", (app) =>
    app
      .get("/", () => FileController.getAllFiles(), {
        detail: { tags: ["Files"], summary: "Get all file" },
      })
      .get("/id/:id", ({ params }) => FileController.getFileById(params.id), {
        params: t.Object({ id: t.String() }),
        detail: { tags: ["Files"], summary: "Get file by id" },
      })
      .get(
        "/name/:name",
        ({ params }) => FileController.getFileByName(params.name),
        {
          params: t.Object({ name: t.String() }),
          detail: { tags: ["Files"], summary: "Get file by name" },
        }
      )
      .post("/", ({ body }) => FileController.createFile(body as FileDTO), {
        body: t.Object({
          name: t.String(),
          folderId: t.String(),
          mimeType: t.String(),
          sizeBytes: t.Number(),
          updatedAt : t.Date()
        }),
        detail: { tags: ["Files"], summary: "Create a new file" },
      })
      .patch(
        "/:id",
        ({ params: { id }, body }) =>
          FileController.updateFile(id, body as FileDTO),
        {
          body: t.Object({
            name: t.Optional(t.String()),
            folderId: t.Optional(t.String()),
            mimeType: t.Optional(t.String()),
            sizeBytes: t.Optional(t.Number()),
            updatedAt: t.Date()
          }),
          detail: { tags: ["Files"], summary: "Update file" },
        }
      )
      .delete(
        "/:id",
        ({ params }) => FileController.deleteFileById(params.id),
        {
          params: t.Object({ id: t.String() }),
          detail: { tags: ["Files"], summary: "Delete file by id" },
        }
      )
  );
