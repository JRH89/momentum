// Type definitions for the database client

declare module '@/lib/db' {
  import { PrismaClient } from '@prisma/client';

  const prisma: PrismaClient;
  export default prisma;

  // Export individual models for testing
  export const project: {
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
  };

  export const invoice: {
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
  };
}
