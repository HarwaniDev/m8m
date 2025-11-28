"use client"
import { memo, useState } from "react"
import { PlaceholderNode } from "../reactflow/placeholder-node"
import { Globe, MousePointerIcon, PlusIcon } from "lucide-react"
import { WorkflowNode } from "./workflow-node"
import type { NodeProps } from "@xyflow/react"
import NodeSelector from "./node-selector"

export const InitialNode = memo((props: NodeProps) => {
    const [openSheet, setOpenSheet] = useState(false);
    return (
        <NodeSelector open={openSheet} setOpen={setOpenSheet}>
            <WorkflowNode>
                <PlaceholderNode
                    {...props}
                    onClick={() => setOpenSheet(true)}
                >
                    <div className="cursor-pointer flex items-center justify-center ">
                        <PlusIcon className="size-4" />
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>

    )
});


export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode name="Manual Trigger" >
            <PlaceholderNode
                {...props}
                onClick={() => { }}>
                <div className="cursor-pointer flex items-center justify-center ">
                    <MousePointerIcon />
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
})

export const HTTPNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode name="HTTP Request" >
            <PlaceholderNode
                {...props}
                onClick={() => { }}>
                <div className="cursor-pointer flex items-center justify-center ">
                    <Globe />
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
})