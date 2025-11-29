"use client"

import type { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import BaseExecutionNode from "../base-execution-node";
import { GlobeIcon } from "lucide-react";

type HTTPRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: string;
    [key: string]: unknown;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
    const nodeData = props.data;
    const description = nodeData.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint} `
        : "Not configured";
    return (
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={GlobeIcon}
            name="HTTP Request"
            description={description}
            onSettings={() => { }}
            onDoubleClick={() => { }}
        />
    )
})

