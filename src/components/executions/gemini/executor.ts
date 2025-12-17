import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "~/components/triggers/types";
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { geminiRequestChannel } from "~/inngest/channels/gemini";

type GeminiData = {
    variableName?: string;
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

    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
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

        await publish(
            geminiRequestChannel().status({
                nodeId,
                status: "success"
            })
        );
        return {
            ...context,
            [data.variableName]: {
                text
            }
        }
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