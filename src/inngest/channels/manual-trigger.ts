import { channel, topic } from "@inngest/realtime";

export const manualTriggerRequestChannel = channel("manual-trigger-execution").addTopic(topic("status").type<{
    nodeId: string,
    status: "loading" | "success" | "error"
}>())
