"use client"

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "./use-node-status";
import { fetchGoogleFormTriggerFunctionRealtimeToken } from "./actions";

const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: "google-form-trigger-execution",
        topic: "status",
        refreshToken: fetchGoogleFormTriggerFunctionRealtimeToken
    })

    return (
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={"/googleform.svg"}
                name="Google Form"
                description="When google form is submitted"
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
});

export default GoogleFormTriggerNode;

