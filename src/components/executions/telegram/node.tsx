"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import { useNodeStatus } from "./use-node-status";
import { TelegramDialog } from "./dialog";
import { fetchTelegramFunctionRealtimeToken } from "./actions";


type TelegramNodeData = {
    variableName?: string;
    chatId?: string;
    content?: string;
    credentialId?: string
};

type TelegramNodeType = Node<TelegramNodeData>;

export const TelegramNode = memo((props: NodeProps<TelegramNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (
        values: {
            variableName?: string;
            chatId?: string;
            content?: string;
            credentialId?: string
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
        channel: "telegram-execution",
        topic: "status",
        refreshToken: fetchTelegramFunctionRealtimeToken
    })
    const nodeData = props.data;
    const description = (nodeData.content && nodeData.variableName) ? `${nodeData.variableName}: ${nodeData.content.slice(0, 20)} `
        : "Not configured";

    return (
        <>
            <TelegramDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultContent={nodeData.content}
                defaultCredentialId={nodeData.credentialId}
                defaultChatId={nodeData.chatId}
                defaultVariableName={nodeData.variableName}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/telegram.svg"}
                name="Telegram"
                description={description}
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
})

