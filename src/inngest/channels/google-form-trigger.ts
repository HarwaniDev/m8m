import { channel, topic } from "@inngest/realtime";

export const googleFormTriggerRequestChannel = channel("google-form-trigger-execution").addTopic(topic("status").type<{
    nodeId: string,
    status: "loading" | "success" | "error"
}>())
