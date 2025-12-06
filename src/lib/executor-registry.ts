import { NodeType } from "generated/prisma";
import { httpRequestExecutor } from "~/components/executions/http-request/executor";
import type { NodeExecutor } from "~/components/executions/types";
import { ManualTriggerExecutor } from "~/components/triggers/manual-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: ManualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor
}

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
    const executor = executorRegistry[nodeType];
    if (!executor) {
        throw new Error(`No executor found for node type: ${nodeType}`)
    };
    return executor;
}