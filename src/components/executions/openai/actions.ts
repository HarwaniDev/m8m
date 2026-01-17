"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { openaiRequestChannel } from "~/inngest/channels/openai";
import { inngest } from "~/inngest/client";

export type openaiToken = Realtime.Token<
    typeof openaiRequestChannel,
    ["status", "result"]
>;

export async function fetchOpenAIFunctionRealtimeToken(): Promise<openaiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: openaiRequestChannel(),
        topics: ["status", "result"]
    });
    return token;
}
