import type { NodeExecutor } from "~/components/triggers/types";
import { googleFormTriggerRequestChannel } from "~/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const GoogleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
    nodeId,
    data,
    context,
    step,
    publish
}) => {
    await publish(googleFormTriggerRequestChannel().status({
        nodeId,
        status: "loading"
    }));
    const result = await step.run("google-form-trigger", async () => context);
    await publish(googleFormTriggerRequestChannel().status({
        nodeId,
        status: "success"
    }));
    return result;
};