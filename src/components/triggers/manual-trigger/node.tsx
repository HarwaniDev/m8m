"use client"

import type { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";

const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <BaseTriggerNode
            {...props}
            id={props.id}
            icon={MousePointerIcon}
            name="Manual Trigger"
        // description={description}
        // onSettings={() => { }}
        // onDoubleClick={() => { }}
        />
    )
});

export default ManualTriggerNode;

