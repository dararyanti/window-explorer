import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFolder(name: string, parent?: { id: string; mpath: string; depth: number }) {
  const mpath = (parent?.mpath ?? "") + "/" + name;
  const depth = (parent?.depth ?? -1) + 1;
  return prisma.folder.create({ data: { name, parentId: parent?.id ?? null, mpath, depth } });
}

async function main() {
  console.log("Seeding database...");
  await prisma.file.deleteMany();
  await prisma.folder.deleteMany();

  const root = await createFolder("root");
  const docs = await createFolder("Documents", root);
  const pics = await createFolder("Pictures", root);
  const vids = await createFolder("Videos", root);

  const work = await createFolder("Work", docs);
  const personal = await createFolder("Personal", docs);

  const y2024 = await createFolder("2024", work);
  const y2025 = await createFolder("2025", work);

  const trips = await createFolder("Trips", pics);
  const family = await createFolder("Family", pics);

  await prisma.file.createMany({
    data: [
      { name: "resume.pdf", sizeBytes: 143000, mimeType: "application/pdf", folderId: personal.id },
      { name: "q1-report.xlsx", sizeBytes: 520100, mimeType: "application/vnd.ms-excel", folderId: y2025.id },
      { name: "beach.png", sizeBytes: 2104333, mimeType: "image/png", folderId: trips.id }
    ]
  });

  console.log("Seeding done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
