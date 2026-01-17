import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const executionRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "id is required")
        }))
        .query(({ ctx, input }) => {
            return ctx.db.execution.findUniqueOrThrow({
                where: {
                    id: input.id,
                    workflow: { userId: ctx.session.user.id },
                },
                include: {
                    workflow: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
        }),
    getMany: protectedProcedure
        .query(({ ctx }) => {
            return ctx.db.execution.findMany({
                where: { workflow: { userId: ctx.session.user.id } },
                orderBy: { startedAt: "desc" },
                include: {
                    workflow: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        })
})