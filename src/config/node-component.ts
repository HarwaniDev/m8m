import type { NodeTypes } from "@xyflow/react";
import { NodeType } from "generated/prisma";
import { DiscordNode } from "~/components/executions/discord/node";
import { GeminiNode } from "~/components/executions/gemini/node";
import { HTTPRequestNode } from "~/components/executions/http-request/node";
import { TelegramNode } from "~/components/executions/telegram/node";
import { InitialNode } from "~/components/initial/node";
import GoogleFormTriggerNode from "~/components/triggers/google-form-trigger/node";
import ManualTriggerNode from "~/components/triggers/manual-trigger/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HTTPRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.TELEGRAM]: TelegramNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;