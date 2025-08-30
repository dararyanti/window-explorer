import { logger } from "../../lib/logger";
import prisma from "../../lib/prisma";
import { apiResponse } from "../../utils/response";
import { FileController } from "../file/file.controller";
import type { FolderDTO } from "./folder.types";

export const FolderController = {
  async listAll() {
    try {
      const getData = await prisma.folder.findMany({
        orderBy: [{ depth: "asc" }, { name: "asc" }],
      });
      return apiResponse({
        message: "Folder list fetched",
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting folder: ${e}`);
    }
  },

  async getChildren(folderId: string) {
    try {
      const getData = await prisma.folder.findMany({
        where: { parentId: folderId },
        orderBy: { name: "asc" },
      });
      return apiResponse({
        message: "Child Folder list fetched",
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting folder: ${e}`);
    }
  },

  async createFolder(folderDto: FolderDTO) {
    try {
      let mpath = `/${folderDto.name}`;
      let depth = 0;
      if (folderDto.parentId) {
        const parent = await prisma.folder.findUnique({
          where: { id: folderDto.parentId },
        });
        if (!parent) {
          throw new Error(`Parent folder ${folderDto.parentId} not found`);
        }
        mpath = `${parent.mpath}/${folderDto.name}`;
        depth = parent.depth + 1;
      }
      const newData = await prisma.folder.create({
        data: {
          name: folderDto.name,
          parentId: folderDto.parentId,
          depth,
          mpath,
        },
      });
      return apiResponse({
        message: `Success create folder id: ${newData.id}`,
        content: newData,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error create folder: ${e}`);
      throw e;
    }
  },

  async updateFolder(folderId: string, folderDto: FolderDTO) {
    try {
      let mpath = `/${folderDto.name}`;
      let depth = 0;
      if (folderDto.parentId) {
        const parent = await prisma.folder.findUnique({
          where: { id: folderDto.parentId },
        });
        if (!parent) {
          throw new Error(`Parent folder ${folderDto.parentId} not found`);
        }
        mpath = `${parent.mpath}/${folderDto.name}`;
        depth = parent.depth + 1;
      }
      const updatedFolder = await prisma.folder.update({
        where: { id: folderId },
        data: {
          name: folderDto.name,
          parentId: folderDto.parentId,
          depth,
          mpath,
          updatedAt:folderDto.updatedAt
        },
      });
      const updateChildren = async (
        parentId: string,
        parentMpath: string,
        parentDepth: number
      ) => {
        const children = await prisma.folder.findMany({
          where: { parentId },
        });
        for (const child of children) {
          const newMpath = `${parentMpath}/${child.name}`;
          const newDepth = parentDepth + 1;
          await prisma.folder.update({
            where: { id: child.id },
            data: {
              mpath: newMpath,
              depth: newDepth,
            },
          });
          await updateChildren(child.id, newMpath, newDepth);
        }
      };
      await updateChildren(folderId, mpath, depth);
      return apiResponse({
        message: `Success update folder id: ${folderId}`,
        content: updatedFolder,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error update folder: ${e}`);
      throw e;
    }
  },

  async deleteFolder(folderId: string) {
    try {
      const folders = await this.getChildren(folderId);
      if (folders?.total?? 0 > 0) {
        const content = Array.isArray(folders?.content) ? folders.content : [folders?.content];
        const folderIds = content.map(folder => folder?.id??'');
        for (const id of folderIds) {
          await prisma.folder.delete({ where: { id: id } });
          logger.info(`Success delete child folder with id: ${id}`)
        }
      }
      const files = await FileController.getFileByFolder(folderId);
      if (files?.total?? 0 > 0) {
        const content = Array.isArray(files?.content) ? files.content : [files?.content];
        const fileIds = content.map(file => file?.id??'');
        for (const id of fileIds) {
          await FileController.deleteFileById(id)
          logger.info(`Success delete file with id: ${id}`)
        }
      }
      await prisma.folder.delete({ where: { id: folderId } });
      return apiResponse({
        message: `Success delete folder id: ${folderId}`,
      });
    } catch (e: unknown) {
      console.error(`Error delete folder: ${e}`);
    }
  },
  async getFolderById(folderId: string) {
    try {
      const getData = await prisma.folder.findUnique({
        where: { id: folderId },
      });
      return apiResponse({
        message: `Get Folder id: ${folderId}`,
        content: getData,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error getting folder: ${e}`);
    }
  },

  async getFolderByName(folderName: string) {
    try {
      const getData = await prisma.folder.findMany({
        where: { name: folderName },
      });
      return apiResponse({
        message: `Folder list fetched`,
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting folder: ${e}`);
    }
  },
};
