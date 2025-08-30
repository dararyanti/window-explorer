import prisma from "../../lib/prisma";
import { apiResponse } from "../../utils/response";
import type { FileDTO } from "./file.types";

export const FileController = {
  async getFileByFolder(folderId: string) {
    try {
      const getData = await prisma.file.findMany({
        where: { folderId },
        orderBy: [{ name: "asc" }],
      });
      return apiResponse({
        message: "File list fetched",
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting file: ${e}`);
    }
  },

  async getAllFiles() {
    try {
      const getData = await prisma.file.findMany({
        orderBy: [{ name: "asc" }],
      });
      return apiResponse({
        message: "File list fetched",
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting file: ${e}`);
    }
  },

  async getFileById(fileId: string) {
    try {
      const getData = await prisma.file.findUnique({ where: { id: fileId } });
      return apiResponse({
        message: `Get File id: ${fileId}`,
        content: getData,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error getting file: ${e}`);
    }
  },

  async getFileByName(fileName: string) {
    try {
      const getData = await prisma.file.findMany({
        where: { name: fileName },
        orderBy: { name: "asc" },
      });
      return apiResponse({
        message: `File list fetched`,
        content: getData,
        total: getData.length,
      });
    } catch (e: unknown) {
      console.error(`Error getting file: ${e}`);
    }
  },

  async createFile(fileDto: FileDTO) {
    try {
      const newData = await prisma.file.create({
        data: {
          name: fileDto.name,
          sizeBytes: fileDto.sizeBytes,
          mimeType: fileDto.mimeType,
          folderId: fileDto.folderId,
          updatedAt: fileDto.updatedAt
        },
      });
      return apiResponse({
        message: `Success create file id: ${fileDto.id}`,
        content: newData,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error create file: ${e}`);
    }
  },

  async updateFile(fileId: string, fileDto: FileDTO) {
    try {
      const newData = await prisma.file.update({
        where: { id: fileId },
        data: {
          name: fileDto.name,
          folderId: fileDto.folderId,
          mimeType: fileDto.mimeType,
          sizeBytes: fileDto.sizeBytes,
          updatedAt: fileDto.updatedAt
        },
      });
      return apiResponse({
        message: `Success update file id: ${fileId}`,
        content: newData,
        total: 1,
      });
    } catch (e: unknown) {
      console.error(`Error update file: ${e}`);
    }
  },

  async deleteFileById(fileId: string) {
    try {
      await prisma.file.delete({ where: { id: fileId } });
      return apiResponse({
        message: `Success delete file id: ${fileId}`,
      });
    } catch (e: unknown) {
      console.error(`Error delete file: ${e}`);
    }
  },
};
