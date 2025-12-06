"use client"

import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react"
import { Button } from "../button";
import { SettingsIcon, Trash } from "lucide-react";

interface WorkflowNodeProps {
    children: ReactNode;
    showToobar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

export function WorkflowNode({
    children,
    showToobar = true,
    onDelete,
    onSettings,
    name,
    description
}: WorkflowNodeProps) {
    return (
        <>
            {showToobar &&
                <NodeToolbar>
                    <Button size={"sm"} variant={"neutral"} className="mx-1 cursor-pointer" onClick={onSettings}>
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button size={"sm"} variant={"neutral"} className="mx-1 cursor-pointer" onClick={onDelete}>
                        <Trash className="size-4" />
                    </Button>
                </NodeToolbar>
            }
            {children}
            {(showToobar && name) && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"
                >
                    <p className="font-medium">
                        {name}
                    </p>

                    {description && (
                        <p className="text-muted-foreground truncate text-sm">
                            {description}
                        </p>
                    )}
                </NodeToolbar>
            )}
        </>
    )
}