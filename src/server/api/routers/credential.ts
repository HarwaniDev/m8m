import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CredentialType } from "generated/prisma";

export const credentialRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1, "Name is required"),
            type: z.nativeEnum(CredentialType),
            value: z.string().min(1, "value is required")
        }))
        .mutation(({ ctx, input }) => {
            const { name, type, value } = input;
            return ctx.db.credential.create({
                data: {
                    name,
                    type,
                    value,
                    userId: ctx.session.user.id
                }
            });
        }),
    remove: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(({ ctx, input }) => {
            return ctx.db.credential.delete({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id
                }
            })
        }),
    update: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "id is required"),
            name: z.string().min(1, "Name is required"),
            type: z.nativeEnum(CredentialType),
            value: z.string().min(1, "value is required")
        }))
        .mutation(({ ctx, input }) => {
            const { id, name, type, value } = input;
            return ctx.db.credential.update({
                where: { id, userId: ctx.session.user.id },
                data: {
                    name,
                    type,
                    value
                }
            })
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "id is required")
        }))
        .query(({ ctx, input }) => {
            return ctx.db.credential.findUniqueOrThrow({
                where: { id: input.id, userId: ctx.session.user.id }
            })
        }),
    getMany: protectedProcedure
        .query(({ ctx }) => {
            return ctx.db.credential.findMany({
                where: { userId: ctx.session.user.id }
            });
        }),
    getbyType: protectedProcedure
        .input(z.object({
            type: z.nativeEnum(CredentialType)
        }))
        .query(({ ctx, input }) => {
            return ctx.db.credential.findMany({
                where: {
                    userId: ctx.session.user.id,
                    type: input.type
                }
            })
        })
})