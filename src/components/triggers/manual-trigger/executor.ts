import type { NodeExecutor } from "~/components/triggers/types";
import { manualTriggerRequestChannel } from "~/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(manualTriggerRequestChannel().status({
        nodeId,
        status: "loading"
    }));
    const result = await step.run("manual-trigger", async () => context);
    await publish(manualTriggerRequestChannel().status({
        nodeId,
        status: "success"
    }));
    return result;
};