import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "~/server/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "~/lib/executor-registry";
import { anthropicRequestChannel } from "./channels/anthropic";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerRequestChannel } from "./channels/manual-trigger";
import { googleFormTriggerRequestChannel } from "./channels/google-form-trigger";
import { geminiRequestChannel } from "./channels/gemini";
import { openaiRequestChannel } from "./channels/openai";
import { discordRequestChannel } from "./channels/discord";
import { githubRequestChannel } from "./channels/github";
import { telegramRequestChannel } from "./channels/telegram";
import { ExecutionStatus } from "generated/prisma";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO: REMOVE THIS LINE IN PRODUCTION,
    onFailure: async ({ event, step }) => {
      return db.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack
        }
      })
    }
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerRequestChannel(),
      googleFormTriggerRequestChannel(),
      geminiRequestChannel(),
      openaiRequestChannel(),
      anthropicRequestChannel(),
      discordRequestChannel(),
      telegramRequestChannel(),
      githubRequestChannel()
    ]
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    const inngestEventId = event.id;
    if (!workflowId || !inngestEventId) {
      throw new NonRetriableError(" Inngest ID or Workflow ID is missing");
    };
    await step.run("create-exection", async () => {
      await db.execution.create({
        data: {
          workflowId,
          inngestEventId
        }
      })
    })
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        include: {
          nodes: true,
          connections: true
        }
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        select: {
          userId: true
        }
      });
      return workflow.userId;
    });

    let context = event.data.initialData || {};

    // execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish
      })
    }

    await step.run("update-exection", async () => {
      await db.execution.update({
        where: {
          workflowId,
          inngestEventId
        },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context
        }
      })
    })
    return { workflowId, result: context };
  },
);