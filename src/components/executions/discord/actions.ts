"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { discordRequestChannel } from "~/inngest/channels/discord";
import { inngest } from "~/inngest/client";

export type discordToken = Realtime.Token<
    typeof discordRequestChannel,
    ["status"]
>;

export async function fetchDiscordFunctionRealtimeToken(): Promise<discordToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: discordRequestChannel(),
        topics: ["status"]
    });
    return token;
}