"use client"

import { Position, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNode } from "../ui/custom/workflow-node";
import { BaseNode, BaseNodeContent } from "../ui/reactflow/base-node";
import Image from "next/image";
import { BaseHandle } from "../ui/reactflow/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: string;
    onSettings?: () => void;
    onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(({
    id,
    icon: Icon,
    name,
    children,
    description,
    onSettings,
    onDoubleClick
}: BaseExecutionNodeProps) => {
    const handleDelete = () => { };
    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSettings}
        >
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
        </WorkflowNode>
    )
});


export default BaseExecutionNode;