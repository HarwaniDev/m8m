"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HTTPRequestDialog } from "./dialog";
import { useNodeStatus } from "./use-node-status";
import { httpRequestChannel } from "~/inngest/channels/http-request";
import { fetchHttpFunctionRealtimeToken } from "./actions";

type HTTPRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: string;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (
        values: {
            method: string,
            endpoint: string,
            body?: string
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
        channel: "http-request-execution",
        topic: "status",
        refreshToken: fetchHttpFunctionRealtimeToken
    })
    const nodeData = props.data;
    const description = (nodeData.endpoint && nodeData.variableName) ? `${nodeData.variableName}: ${nodeData.endpoint} `
        : "Not configured";

    return (
        <>
            <HTTPRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultEndpoint={nodeData.endpoint}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}
                defaultVariableName={nodeData.variableName}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
})

