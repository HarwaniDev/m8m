"use client"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../breadcrumb";
import EditorNameInput from "./editornameinput";
import { Save } from "lucide-react";
import { api } from "~/trpc/react";
import { useEditor } from "~/contexts/editor-context";
import { useState } from "react";
import { toast } from "sonner";

const WorkflowHeader = ({ workflowId }: { workflowId: string }) => {
    const { nodes, edges } = useEditor();
    const [isSaving, setIsSaving] = useState(false);
    
    const saveWorkflow = api.workflow.save.useMutation({
        onMutate: () => {
            setIsSaving(true);
        },
        onSuccess: () => {
            setIsSaving(false);
            const id = toast.success("Saved successfully");
        },
        onError: () => {
            setIsSaving(false);
            toast.error("Failed to save workflow");
        }
    });

    const handleSave = () => {
        saveWorkflow.mutate({
            id: workflowId,
            nodes,
            edges,
        });
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-blue-100 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-black border border-black hover:bg-blue-50 rounded-md" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <EditorNameInput workflowId={workflowId} />
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex justify-center items-center">
                <Button 
                    variant={"default"} 
                    className="text-white cursor-pointer font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg border-black rounded-lg"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save /> {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </header>
    )
}

export default WorkflowHeader;