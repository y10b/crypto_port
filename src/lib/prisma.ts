import { PrismaClient } from "@prisma/client";

// Next.js hot-reload 환경에서 PrismaClient 중복 생성을 방지
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
