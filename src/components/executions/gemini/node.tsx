"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import { GeminiDialog } from "./dialog";
import { useNodeStatus } from "./use-node-status";
import { fetchGeminiFunctionRealtimeToken } from "./actions";

type GeminiNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (
        values: {
            model?: string;
            systemPrompt?: string;
            userPrompt?: string;
            variableName?: string;
        }
    ) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))
    }
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: "gemini-execution",
        topic: "status",
        refreshToken: fetchGeminiFunctionRealtimeToken
    })
    const nodeData = props.data;
    // const description = (nodeData.endpoint && nodeData.variableName) ? `${nodeData.variableName}: ${nodeData.endpoint} `
    //     : "Not configured";

    return (
        <>
            <GeminiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultSystemPrompt={nodeData.systemPrompt}
                defaultUserPrompt={nodeData.userPrompt}
                defaultVariableName={nodeData.variableName}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/gemini.svg"}
                name="Gemini"
                description={""}
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
})

