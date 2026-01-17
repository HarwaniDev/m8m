import { NodeType } from "generated/prisma";
import { AnthropicExecutor } from "~/components/executions/anthropic/executor";
import { DiscordExecutor } from "~/components/executions/discord/executor";
import { GeminiExecutor } from "~/components/executions/gemini/executor";
import { OpenAIExecutor } from "~/components/executions/openai/executor";
import { httpRequestExecutor } from "~/components/executions/http-request/executor";
import { TelegramExecutor } from "~/components/executions/telegram/executor";
import type { NodeExecutor } from "~/components/executions/types";
import { GithubTriggerExecutor } from "~/components/triggers/github-trigger/executor";
import { GoogleFormTriggerExecutor } from "~/components/triggers/google-form-trigger/executor";
import { ManualTriggerExecutor } from "~/components/triggers/manual-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: ManualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.GEMINI]: GeminiExecutor,
    [NodeType.DISCORD]: DiscordExecutor,
    [NodeType.TELEGRAM]: TelegramExecutor,
    [NodeType.GITHUB]: GithubTriggerExecutor,
    [NodeType.OPENAI]: OpenAIExecutor,
    [NodeType.ANTHROPIC]: AnthropicExecutor
}

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
    const executor = executorRegistry[nodeType];
    if (!executor) {
        throw new Error(`No executor found for node type: ${nodeType}`)
    };
    return executor;
}