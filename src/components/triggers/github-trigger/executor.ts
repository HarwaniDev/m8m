import type { NodeExecutor } from "~/components/triggers/types";
import { githubRequestChannel } from "~/inngest/channels/github";

type GithubTriggerData = Record<string, unknown>;

export const GithubTriggerExecutor: NodeExecutor<GithubTriggerData> = async ({
    nodeId,
    data,
    context,
    step,
    publish
}) => {
    await publish(githubRequestChannel().status({
        nodeId,
        status: "loading"
    }));
    const result = await step.run("github-trigger", async () => context);
    await publish(githubRequestChannel().status({
        nodeId,
        status: "success"
    }));
    return result;
};