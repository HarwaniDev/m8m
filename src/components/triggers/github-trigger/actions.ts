"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { githubRequestChannel } from "~/inngest/channels/github";
import { inngest } from "~/inngest/client";

export type githubTriggerToken = Realtime.Token<
    typeof githubRequestChannel,
    ["status"]
>;

export async function fetchGithubTriggerFunctionRealtimeToken(): Promise<githubTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: githubRequestChannel(),
        topics: ["status"]
    });
    return token;
}