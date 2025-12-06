"use client"

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={MousePointerIcon}
                name="Manual Trigger"
                // description={description}
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
            />
        </>
    )
});

export default ManualTriggerNode;

