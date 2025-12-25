import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/executions/types";
import Handlebars from "handlebars";
import { telegramRequestChannel } from "~/inngest/channels/telegram";
import axios from "axios";
import { db } from "~/server/db";

type TelegramData = {
    variableName?: string;
    chatId?: string;
    content?: string;
    credentialId?: string
};

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
})

export const TelegramExecutor: NodeExecutor<TelegramData> = async ({
    data,
    nodeId,
    userId,
    context,
    step,
    publish
}) => {
    await publish(
        telegramRequestChannel().status({
            nodeId,
            status: "loading"
        })
    );

    try {
        const result = await step.run("telegram-message", async () => {
            if (!data.variableName) {
                await publish(
                    telegramRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Telegram node: variable name is required");
            }

            if (!data.chatId) {
                await publish(
                    telegramRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Telegram node: Chat ID is required");
            }
            if (!data.content) {
                await publish(
                    telegramRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Telegram node: content is required");
            }

            const credential = await db.credential.findUnique({
                where: {
                    id: data.credentialId,
                    userId: userId
                }
            });
            if (!credential) {
                await publish(
                    telegramRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Telegram node: credential is missing");
            }
            const content = Handlebars.compile(data.content)(context).slice(0, 4096);
            console.log(content);
            await axios.post(`https://api.telegram.org/bot${credential.value}/sendMessage`, {
                chat_id: data.chatId,
                text: content
            })

            await publish(
                telegramRequestChannel().status({
                    nodeId,
                    status: "success"
                })
            );
            return {
                ...context,
                [data.variableName]: {
                    messageContent: content
                }
            };
        });
        return result;
    } catch (error: any) {
        await publish(
            telegramRequestChannel().status({
                nodeId,
                status: "error"
            })
        );
        throw error;
    }
};