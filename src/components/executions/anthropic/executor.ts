import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/executions/types";
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { anthropicRequestChannel } from "~/inngest/channels/anthropic";
import { db } from "~/server/db";
import { decrypt } from "~/server/encryption";

type AnthropicData = {
    variableName?: string;
    credentialId?: string;
    systemPrompt?: string,
    userPrompt?: string
};

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
})

export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    userId,
    context,
    step,
    publish
}) => {
    await publish(
        anthropicRequestChannel().status({
            nodeId,
            status: "loading"
        })
    );

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    const credential = await step.run("get-credential", () => {
        return db.credential.findUnique({
            where: {
                id: data.credentialId,
                userId: userId
            }
        });
    });
    if (!credential) {
        throw new NonRetriableError("Anthropic node: Credential not found")
    }
    const anthropic = createAnthropic({
        apiKey: decrypt(credential.value)
    });

    try {
        if (!data.variableName) {
            await publish(
                anthropicRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("variable name can't be empty")
        }
        if (!data.credentialId) {
            await publish(
                anthropicRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("Anthropic node: Credential is required")
        }
        if (!data.userPrompt) {
            await publish(
                anthropicRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("user prompt can't be empty")
        }

        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-3-5-sonnet-20241022"),
                system: systemPrompt,
                prompt: userPrompt
            }
        );

        const text = steps[0]?.content[0]?.type === "text" ? steps[0].content[0].text : "";

        const result = {
            ...context,
            [data.variableName]: {
                text
            }
        };

        await publish(
            anthropicRequestChannel().status({
                nodeId,
                status: "success"
            })
        );
        await publish(
            anthropicRequestChannel().result({
                nodeId,
                result: result[data.variableName]
            })
        );
        return result;
    } catch (error) {
        await publish(
            anthropicRequestChannel().status({
                nodeId,
                status: "error"
            })
        );
        throw error;
    }
};
