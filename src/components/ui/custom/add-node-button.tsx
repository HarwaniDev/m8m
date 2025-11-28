"use client"

import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { Button } from "~/components/ui/button"
import NodeSelector from "./node-selector"

export const AddNodeButton = memo(() => {
    const [open, setOpen] = useState(false);
    return (
        <NodeSelector open={open} setOpen={setOpen}>
            <Button
                onClick={() => setOpen(true)}
                className="border-black cursor-pointer rounded-lg bg-background"
                size={"icon"}
                title="Add node"
            >
                <PlusIcon />
            </Button>
        </NodeSelector>
    )
});

