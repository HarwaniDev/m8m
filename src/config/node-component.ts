import type { NodeTypes } from "@xyflow/react";
import { NodeType } from "generated/prisma";
import { HTTPRequestNode } from "~/components/executions/http-request/node";
import { InitialNode } from "~/components/initial/node";
import ManualTriggerNode from "~/components/triggers/manual-trigger/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HTTPRequestNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;