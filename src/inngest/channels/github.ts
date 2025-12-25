import { channel, topic } from "@inngest/realtime";

export const githubRequestChannel = channel("github-execution").addTopic(topic("status").type<{
    nodeId: string,
    status: "loading" | "success" | "error"
}>())
