import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/executions/types";
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { geminiRequestChannel } from "~/inngest/channels/gemini";
import { db } from "~/server/db";
import { decrypt } from "~/server/encryption";

type GeminiData = {
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

export const GeminiExecutor: NodeExecutor<GeminiData> = async ({
    data,
    nodeId,
    userId,
    context,
    step,
    publish
}) => {
    await publish(
        geminiRequestChannel().status({
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
        throw new NonRetriableError("Gemini node: Credential not found")
    }
    const google = createGoogleGenerativeAI({
        apiKey: decrypt(credential.value)
    });

    try {
        if (!data.variableName) {
            await publish(
                geminiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("variable name can't be empty")
        }
        if (!data.credentialId) {
            await publish(
                geminiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("Gemini node: Credential is required")
        }
        if (!data.userPrompt) {
            await publish(
                geminiRequestChannel().status({
                    nodeId,
                    status: "error"
                })
            );
            throw new NonRetriableError("user prompt can't be empty")
        }

        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash"),
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
            geminiRequestChannel().status({
                nodeId,
                status: "success"
            })
        );
        await publish(
            geminiRequestChannel().result({
                nodeId,
                result: result[data.variableName]
            })
        );
        return result;
    } catch (error) {
        await publish(
            geminiRequestChannel().status({
                nodeId,
                status: "error"
            })
        );
        throw error;
    }
};