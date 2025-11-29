"use client"
import { memo, useState } from "react"
import { PlaceholderNode } from "../ui/reactflow/placeholder-node"
import { Globe, MousePointerIcon, PlusIcon } from "lucide-react"
import { WorkflowNode } from "../ui/custom/workflow-node"
import type { NodeProps } from "@xyflow/react"
import NodeSelector from "../ui/custom/node-selector"

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