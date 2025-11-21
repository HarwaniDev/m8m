"use client"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./breadcrumb";
import React from "react";
import EditorNameInput from "./editornameinput";

const WorkflowHeader = ({ workflowId }: { workflowId: string }) => {
    // const { data } = api.workflow.getOne.useQuery({ id: workflowId });

    // const updateWorkflow = api.workflow.update.useMutation({
    //     onMutate: () => {
    //         setIsDisabled(true);
    //         const id = toast.loading("Updating name...");
    //         return { toastId: id }
    //     },

    //     onSuccess: (_data, vars, res) => {
    //         toast.success("Name updated successfully!", {
    //             id: res.toastId
    //         })
    //     },

    //     onError: (error, vars, res) => {
    //         toast.error("Name updated successfully!", {
    //             id: res?.toastId
    //         })
    //     }
    // })
    // const [isEditing, setIsEditing] = useState(false);
    // const [name, setName] = useState(data!.name);
    // const inputRef = useRef<HTMLInputElement>(null);
    // const [isDisabled, setIsDisabled] = useState(false);
    // useEffect(() => {
    //     if (data?.name) {
    //         setName(data.name)
    //     }
    // }, [data?.name]);

    // useEffect(() => {
    //     if (isEditing && inputRef.current) {
    //         inputRef.current.focus();
    //         inputRef.current.select();
    //     }
    // }, [isEditing]);

    // const handleSave = async () => {
    //     if (name === data?.name) {
    //         setIsEditing(false);
    //         return;
    //     }

    //     try {
    //         await updateWorkflow.mutateAsync({ id: workflowId, name: name });
    //     } catch (error) {
    //         setName(data!.name);
    //     } finally {
    //         setIsEditing(false);
    //     }
    // }

    // const handleKeyDown = (e: React.KeyboardEvent) => {
    //     if (e.key === "Enter") {
    //         handleSave();
    //     } else if (e.key === "Escape") {
    //         setName(data!.name);
    //         setIsEditing(false);
    //     }
    // }

    // if (isEditing) {
    //     <Input ref={inputRef}
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         onBlur={handleSave}
    //         onKeyDown={handleKeyDown}
    //         disabled={isDisabled} />
    // }
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
                <Button variant={"default"} className="text-white cursor-pointer font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg border-black rounded-lg">
                    Save
                </Button>
            </div>
        </header>
    )
}

export default WorkflowHeader;