import { Elysia, t } from "elysia";
import { FolderController } from "./folder.controller";
import type { FolderDTO } from "./folder.types";
import { FileController } from "../file/file.controller";

export default (app: Elysia) =>
  app.group("/folders", (app) =>
    app
      .get(
        "/id/:id/children",
        ({ params }) => FolderController.getChildren(params.id),
        {
          params: t.Object({ id: t.String() }),
          detail: { tags: ["Folders"], summary: "Direct subfolders" },
        }
      )
      .post(
        "/",
        ({ body }) => FolderController.createFolder(body as FolderDTO),
        {
          body: t.Object({
            name: t.String(),
            parentId: t.Optional(t.Union([t.String(), t.Null()])),
            depth: t.Number(),
            updatedAt:t.Date()
          }),

          detail: { tags: ["Folders"], summary: "Create a new folder" },
        }
      )
      .patch(
        "/:id",
        ({ params, body }) =>
          FolderController.updateFolder(params.id, body as FolderDTO),
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({
            name: t.Optional(t.String()),
            parentId: t.Optional(t.Null()),
            depth: t.Optional(t.Number()),
          }),
          detail: { tags: ["Folders"], summary: "Update folder" },
        }
      )
      .delete(
        "/:id",
        ({ params: { id } }) => FolderController.deleteFolder(id),
        {
          detail: { tags: ["Folders"], summary: "Delete folder" },
        }
      )
      .get(
        "/id/:id",
        ({ params }) => FolderController.getFolderById(params.id),
        {
          params: t.Object({ id: t.String() }),
          detail: { tags: ["Folders"], summary: "Get folder by id" },
        }
      )
      .get("/:id/files", ({ params }) => FileController.getFileByFolder(params.id), {
        params: t.Object({ id: t.String() }),
        detail: { tags: ["Folders"], summary: "Files in folder" },
      })
      .get(
        "/name/:name",
        ({ params }) => FolderController.getFolderByName(params.name),
        {
          params: t.Object({ name: t.String() }),
          detail: { tags: ["Folders"], summary: "Get folder by name" },
        }
      )
      .get("/", () => FolderController.listAll(), {
        detail: { tags: ["Folders"], summary: "Get all folder" },
      })
  );
