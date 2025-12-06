import type { NodeExecutor } from "~/components/triggers/types";

type httpRequestData = Record<string, unknown>;

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
    data,
    nodeId,
    context,
    step
}) => {
    const result = await step.run("http-request", async () => context);
    return result;
};