"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { googleFormTriggerRequestChannel } from "~/inngest/channels/google-form-trigger";
import { inngest } from "~/inngest/client";

export type googleFormTriggerToken = Realtime.Token<
    typeof googleFormTriggerRequestChannel,
    ["status"]
>;

export async function fetchGoogleFormTriggerFunctionRealtimeToken(): Promise<googleFormTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerRequestChannel(),
        topics: ["status"]
    });
    return token;
}