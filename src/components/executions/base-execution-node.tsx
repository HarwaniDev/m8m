"use client"

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNode } from "../ui/custom/workflow-node";
import { BaseNode, BaseNodeContent } from "../ui/reactflow/base-node";
import Image from "next/image";
import { BaseHandle } from "../ui/reactflow/base-handle";
import { NodeStatusIndicator, type NodeStatus } from "../ui/reactflow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: string;
    status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(({
    id,
    icon: Icon,
    name,
    children,
    status = "initial",
    description,
    onSettings,
    onDoubleClick
}: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
        setNodes((currentNodes) => (
            currentNodes.filter((node) => node.id !== id)
        ));

        setEdges((currentEdges) => (
            currentEdges.filter((edge) => (
                edge.source !== id && edge.target !== id
            )))
        )
    };
    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSettings}
        >
            <NodeStatusIndicator status={status} variant="border">
                <BaseNode onDoubleClick={onDoubleClick}>
                    <BaseNodeContent>
                        {typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : (
                            <Icon className="size-4 text-muted-foreground"></Icon>
                        )}
                        {children}
                        <BaseHandle
                            id={"target-1"}
                            type="target"
                            position={Position.Left}>
                        </BaseHandle>
                        <BaseHandle
                            id={"source-1"}
                            type="source"
                            position={Position.Right}>
                        </BaseHandle>
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    )
});


export default BaseExecutionNode;