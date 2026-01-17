import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/executions/types";
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai";
import Handlebars from "handlebars";
import { openaiRequestChannel } from "~/inngest/channels/openai";
import { db } from "~/server/db";
import { decrypt } from "~/server/encryption";

type OpenAIData = {
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

export const OpenAIExecutor: NodeExecutor<OpenAIData> = async ({
    data,
    nodeId,
    userId,
    context,
    step,
    publish
}) => {
    await publish(
        openaiRequestChannel().status({
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
        throw new NonRetriableError("OpenAI node: Credential not found")
    }
    const openai = createOpenAI({
        apiKey: decrypt(credential.value)
    });

    try {
        if (!data.variableName) {
            await publish(
                openaiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("variable name can't be empty")
        }
        if (!data.credentialId) {
            await publish(
                openaiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("OpenAI node: Credential is required")
        }
        if (!data.userPrompt) {
            await publish(
                openaiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("user prompt can't be empty")
        }

        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("o3-mini-2025-01-31"),
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
            openaiRequestChannel().status({
                nodeId,
                status: "success"
            })
        );
        await publish(
            openaiRequestChannel().result({
                nodeId,
                result: result[data.variableName]
            })
        );
        return result;
    } catch (error) {
        await publish(
            openaiRequestChannel().status({
                nodeId,
                status: "error"
            })
        );
        throw error;
    }
};
