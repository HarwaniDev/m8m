import { channel, topic } from "@inngest/realtime";

export const openaiRequestChannel = channel("openai-execution")
    .addTopic(topic("status").type<{
        nodeId: string,
        status: "loading" | "success" | "error"
    }>())
    .addTopic(topic("result").type<{
        nodeId: string,
        result: unknown
    }>())
