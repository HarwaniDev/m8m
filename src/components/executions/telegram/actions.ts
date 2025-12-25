"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { telegramRequestChannel } from "~/inngest/channels/telegram";
import { inngest } from "~/inngest/client";

export type telegramToken = Realtime.Token<
    typeof telegramRequestChannel,
    ["status"]
>;

export async function fetchTelegramFunctionRealtimeToken(): Promise<telegramToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: telegramRequestChannel(),
        topics: ["status"]
    });
    return token;
}