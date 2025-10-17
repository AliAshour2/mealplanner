import { createMcpServer } from "@captureproof/model-context-protocol";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mcpServer = createMcpServer({
  routes: {
    "/api/profile": {
      model: "Profile",
      operations: {
        get: async (ctx) => {
          const { userId } = ctx.params;
          const profile = await prisma.profile.findUnique({
            where: { userId },
          });
          return { data: profile };
        },
        update: async (ctx) => {
          const { userId, data } = ctx.params;
          const profile = await prisma.profile.update({
            where: { userId },
            data,
          });
          return { data: profile };
        }
      }
    },
    "/api/meal-plans": {
      model: "MealPlan",
      operations: {
        create: async (ctx) => {
          const { userId, data } = ctx.params;
          // Implementation for creating meal plans
          return { data: {} };
        },
        get: async (ctx) => {
          const { userId, id } = ctx.params;
          // Implementation for getting meal plans
          return { data: {} };
        }
      }
    }
  }
});
