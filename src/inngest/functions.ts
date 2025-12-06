import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "~/server/db";
import { topologicalSort } from "./utils";
import type { NodeType } from "generated/prisma";
import { getExecutor } from "~/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    };

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

    let context = event.data.initialData || {};

    // execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step
      })
    }
    return { workflowId, result: context };
  },
);