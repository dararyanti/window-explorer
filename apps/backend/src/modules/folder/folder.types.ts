export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  depth: number;
  updatedAt: Date;
}
