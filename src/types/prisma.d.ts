// This file is used to provide TypeScript type definitions for the Prisma client
// and ensure type safety throughout the application.

import { PrismaClient } from '@prisma/client';

declare global {
  // This prevents multiple instances of Prisma Client in development
  var prisma: PrismaClient | undefined;
}

export {};
