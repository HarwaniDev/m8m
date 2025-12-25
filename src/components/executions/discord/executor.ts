import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/executions/types";
import Handlebars from "handlebars";
import { discordRequestChannel } from "~/inngest/channels/discord";
import axios, { AxiosError } from "axios";

type DiscordData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
};

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
})

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        discordRequestChannel().status({
            nodeId,
            status: "loading"
        })
    );

    try {
        const result = await step.run("discord-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    discordRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Discord node: variable name is required");
            }

            if (!data.webhookUrl) {
                await publish(
                    discordRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Discord node: webhook URL is required");
            }
            if (!data.content) {
                await publish(
                    discordRequestChannel().status({
                        nodeId,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Discord node: content is required");
            }
            const webhookUrl = Handlebars.compile(data.webhookUrl)(context);
            const content = Handlebars.compile(data.content)(context);
            const username = data.username;

            const payload: {
                username?: string,
                content: string
            } = {
                content: content.slice(0, 2000)
            };

            if (typeof username === "string" && username.trim() !== "") {
                payload.username = username;
            }


            await axios.request({
                url: webhookUrl,
                method: "POST",
                data: payload,
            });
            await publish(
                discordRequestChannel().status({
                    nodeId,
                    status: "success"
                })
            );
            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000)
                }
            };
        });
        return result;
    } catch (error: any) {
        await publish(
            discordRequestChannel().status({
                nodeId,
                status: "error"
            })
        );
        throw error;
    }
};