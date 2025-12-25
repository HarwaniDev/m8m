"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"
import { Button } from "../button"
import { useCallback, type ComponentType, type ReactNode } from "react"
import { NodeType } from "generated/prisma"
import { GlobeIcon, MousePointerIcon } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { toast } from "sonner"
import { createId } from "@paralleldrive/cuid2"

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        description: "This node is used to start the workflow manually. Great for quickly getting of the ground",
        icon: MousePointerIcon
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form",
        description: "Runs the flow when google form is submitted",
        icon: "/googleform.svg"
    }
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request",
        icon: GlobeIcon
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Use the Gemini model",
        icon: "/gemini.svg"
    },
    {
        type: NodeType.DISCORD,
        label: "Discord",
        description: "Use the Discord node to send messages",
        icon: "/discord.svg"
    },
    {
        type: NodeType.TELEGRAM,
        label: "Telegram",
        description: "Use the Telegram node to send messages",
        icon: "/telegram.svg"
    }
]

const NodeSelector = ({ children, open, setOpen }: { children: ReactNode, open: boolean, setOpen: (open: boolean) => void }) => {

    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selected: NodeTypeOption) => {
        if (selected.type === "MANUAL_TRIGGER") {
            const nodes = getNodes();
            const manualTrigger = nodes.some((node) => node.type === selected.type)
            if (manualTrigger) {
                toast.error("Only one manual trigger allowed per workflow!")
                return;
            };
        }
        setNodes((nodes) => {
            const initialNode = nodes.some((node) => node.type === NodeType.INITIAL);

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200
            });

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selected.type
            };

            if (initialNode) {
                return [newNode];
            };
            return [...nodes, newNode];
        });
        setOpen(false);
    }, [setNodes, getNodes, screenToFlowPosition, setOpen])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Node Types</SheetTitle>
                    <SheetDescription>
                        Select different types of nodes
                    </SheetDescription>
                </SheetHeader>
                {
                    triggerNodes.map((node) => {
                        const Icon = node.icon;
                        return (
                            <div
                                key={node.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent 
                                hover:border-l-blue-600"
                                onClick={() => handleNodeSelect(node)}
                            >
                                <div>
                                    {typeof Icon === "string" ? (
                                        <div className="flex items-center justify-baseline h-auto">
                                            <img src={Icon} alt={node.label} className="size-8 mr-7 object-contain rounded-sm" />
                                            <div className="flex-col">
                                                <p className="font-semibold">{node.label}</p>
                                                <p className="font-light text-foreground">{node.description}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-baseline h-auto">
                                            <Icon className="size-8 mr-7" />
                                            <div className="flex-col">
                                                <p className="font-semibold">{node.label}</p>
                                                <p className="font-light text-foreground">{node.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
                {
                    executionNodes.map((node) => {
                        const Icon = node.icon;
                        return (
                            <div
                                key={node.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent 
                                hover:border-l-blue-600"
                                onClick={() => handleNodeSelect(node)}
                            >
                                <div>
                                    {typeof Icon === "string" ? (
                                        <div className="flex items-center justify-baseline h-auto">
                                        <img src={Icon} alt={node.label} className="size-8 mr-7 object-contain rounded-sm" />
                                        <div className="flex-col">
                                            <p className="font-semibold">{node.label}</p>
                                            <p className="font-light text-foreground">{node.description}</p>
                                        </div>
                                    </div>
                                    ) : (
                                        <div className="flex items-center justify-baseline h-auto">
                                            <Icon className="size-5 mr-7" />
                                            <div className="flex-col">
                                                <p className="font-semibold">{node.label}</p>
                                                <p className="font-light text-foreground">{node.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="neutral" className="cursor-pointer">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>

    )
}

export default NodeSelector;