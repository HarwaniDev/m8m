import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "~/server/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "~/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerRequestChannel } from "./channels/manual-trigger";
import { googleFormTriggerRequestChannel } from "./channels/google-form-trigger";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", 
    retries: 0 // TODO: REMOVE THIS LINE IN PRODUCTION
    },
  {
    event: "workflows/execute.workflow",
    channels: [httpRequestChannel(), manualTriggerRequestChannel(), googleFormTriggerRequestChannel()]
  },
  async ({ event, step, publish }) => {
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
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish
      })
    }
    return { workflowId, result: context };
  },
);