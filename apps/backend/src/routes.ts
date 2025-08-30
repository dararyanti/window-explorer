import type Elysia from "elysia";
import folderRoute from "./modules/folder/folder.route";

export const routes = (app: Elysia) => app.use(folderRoute)