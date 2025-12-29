"use client"

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { GithubTriggerDialog } from "./dialog";
import { useNodeStatus } from "./use-node-status";
import { fetchGithubTriggerFunctionRealtimeToken } from "./actions";

const GithubTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: "github-execution",
        topic: "status",
        refreshToken: fetchGithubTriggerFunctionRealtimeToken
    })

    return (
        <>
            <GithubTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={"/github.svg"}
                name="Github"
                description="When an event is occured"
                onSettings={() => setDialogOpen(true)}
                onDoubleClick={() => setDialogOpen(true)}
                status={nodeStatus}
            />
        </>
    )
});

export default GithubTriggerNode;

