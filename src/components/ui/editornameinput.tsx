"use client"

import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { BreadcrumbItem } from "./breadcrumb";

const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data } = api.workflow.getOne.useQuery({ id: workflowId });
    const utils = api.useUtils();
    const updateWorkflow = api.workflow.update.useMutation({
        onMutate: () => {
            setIsDisabled(true);
            const id = toast.loading("Updating name...");
            return { toastId: id }
        },

        onSuccess: (_data, vars, res) => {
            toast.success("Name updated successfully!", {
                id: res.toastId
            });
            utils.workflow.getOne.invalidate({ id: workflowId });
        },

        onError: (error, vars, res) => {
            toast.error("Name updated successfully!", {
                id: res?.toastId
            })
        }
    })
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data?.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        if (data?.name) {
            setName(data.name)
        }
    }, [data?.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (name === data?.name) {
            setIsEditing(false);
            return;
        }

        try {
            await updateWorkflow.mutateAsync({ id: workflowId, name: name! });
        } catch (error) {
            setName(data!.name);
        } finally {
            setIsEditing(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setName(data!.name);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        return (
            <Input ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                className="h-7 w-auto min-w-[100px] px-2 border-black rounded-lg ">
            </Input>
        )
    }
    return (
        <>
            <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer">
                {data?.name}
            </BreadcrumbItem>
        </>
    )
}

export default EditorNameInput;