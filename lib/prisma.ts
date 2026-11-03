import { PrismaClient } from "@prisma/client";

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("connection_limit=")) {
  const separator = process.env.DATABASE_URL.includes("?") ? "&" : "?";
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}connection_limit=1&pool_timeout=20`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
