import type { NodeTypes } from "@xyflow/react";
import { NodeType } from "generated/prisma";
import { HTTPNode, InitialNode, ManualTriggerNode } from "~/components/ui/custom/all-nodes";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HTTPNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;