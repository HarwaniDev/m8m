"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { geminiRequestChannel } from "~/inngest/channels/gemini";
import { inngest } from "~/inngest/client";

export type geminiToken = Realtime.Token<
    typeof geminiRequestChannel,
    ["status"]
>;

export async function fetchGeminiFunctionRealtimeToken(): Promise<geminiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: geminiRequestChannel(),
        topics: ["status"]
    });
    return token;
}