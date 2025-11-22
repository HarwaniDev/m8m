"use client"

import { PlusIcon } from "lucide-react"
import { memo } from "react"
import { Button } from "~/components/ui/button"

export const AddNodeButton = memo(() => {
    return (
        <Button
            onClick={() => { }}
            className="border-black cursor-pointer rounded-lg bg-background"
            size={"icon"}
            title="Add node"
        >
            <PlusIcon />
        </Button>
    )
})