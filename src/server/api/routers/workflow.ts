import { z } from "zod";
import { generateSlug } from "random-word-slugs"
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const workflowRouter = createTRPCRouter({
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.workflow.create({
        data: {
          name: generateSlug(3),
          userId: ctx.session.user.id
        }
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const existingWorkflow = await ctx.db.workflow.findFirst({
        where: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });

      if (existingWorkflow) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workflow name already exists. Please choose a different name.",
        });
      };
      return ctx.db.workflow.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        },
        data: {
          name: input.name
        }
      });
    }),

  getOne: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        }
      })
    }),

  getMany: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return ctx.db.workflow.findMany({
        where: {
          userId: ctx.session.user.id
        }
      })
    })

});
