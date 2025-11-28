import { string, z } from "zod";
import { generateSlug } from "random-word-slugs"
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";

export const workflowRouter = createTRPCRouter({
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.workflow.create({
        data: {
          name: generateSlug(3),
          userId: ctx.session.user.id,
          nodes: {
            create: {
              type: "INITIAL",
              position: { x: 0, y: 0 },
              name: "INITIAL"
            }
          }
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

  save: protectedProcedure
    .input(z.object({
      workflowId: z.string(),
      userId: z.string(),
      nodes: z.custom<Node[]>(),
      edges: z.custom<Edge[]>(),
    }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.findUnique({
        where: {
          id: input.workflowId,
          userId: ctx.session.user.id,
        },
        include: {
          nodes: true,
          connections: true
        }
      });
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "The workflow does not exist." });
      };
      // transform react-flow nodes back to db compatible
      // await ctx.db.workflow.
    }),

  getOne: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        },
        include: {
          nodes: true, connections: true
        }
      });
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "The workflow you are looking for does not exist." })
      }
      // transform db nodes to react-flow nodes
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number, y: number },
        data: (node.data as Record<string, unknown>) || {}
      }));

      // transform db connections to react-flow edges
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges
      }
    }),

  getMany: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return ctx.db.workflow.findMany({
        where: {
          userId: ctx.session.user.id
        }, orderBy: {
          createdAt: "desc"
        }
      })
    })

});
