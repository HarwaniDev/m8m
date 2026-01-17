"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { anthropicRequestChannel } from "~/inngest/channels/anthropic";
import { inngest } from "~/inngest/client";

export type anthropicToken = Realtime.Token<
    typeof anthropicRequestChannel,
    ["status", "result"]
>;

export async function fetchAnthropicFunctionRealtimeToken(): Promise<anthropicToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: anthropicRequestChannel(),
        topics: ["status", "result"]
    });
    return token;
}
