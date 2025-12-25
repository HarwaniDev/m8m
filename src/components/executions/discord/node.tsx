"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import { useNodeStatus } from "./use-node-status";
import { DiscordDialog } from "./dialog";
import { fetchDiscordFunctionRealtimeToken } from "./actions";


type DiscordNodeData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (
        values: {
            variableName?: string;
            webhookUrl?: string;
            content?: string;
            username?: string
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
        channel: "discord-execution",
        topic: "status",
        refreshToken: fetchDiscordFunctionRealtimeToken
    })
    const nodeData = props.data;
    const description = (nodeData.variableName && nodeData.content) ? `${nodeData.variableName}: ${nodeData.content.slice(0, 20)} `
        : "Not configured";

    return (
        <>
            <DiscordDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultContent={nodeData.content}
                defaultUsername={nodeData.username}
                defaultWebhookURL={nodeData.webhookUrl}
                defaultVariableName={nodeData.variableName}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/discord.svg"}
                name="Discord"
                description={description}
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
})

