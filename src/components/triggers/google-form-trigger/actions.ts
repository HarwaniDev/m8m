"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { manualTriggerRequestChannel } from "~/inngest/channels/manual-trigger";
import { inngest } from "~/inngest/client";

export type manualTriggerToken = Realtime.Token<
typeof manualTriggerRequestChannel,
["status"]
>;

export async function fetchManualTriggerFunctionRealtimeToken(): Promise<manualTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: manualTriggerRequestChannel(),
        topics: ["status"]
    });
    return token;
}