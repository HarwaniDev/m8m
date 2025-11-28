"use client"
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Plus } from "lucide-react";
import WorkflowEntity from "~/components/ui/custom/workflow-entity";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { LoaderThree } from "~/components/ui/loader";
import EmptyState from "~/components/ui/custom/empty-state";

const WorkflowComponent = () => {
    const utils = api.useUtils();

    // TODO:- add loading and error component
    const { data, isLoading, isError, error } = api.workflow.getMany.useQuery({});
    const [isDisabled, setIsDisabled] = useState(false);
    const createWorkflow = api.workflow.create.useMutation({
        onMutate: () => {
            const id = toast.loading("Creating a workflow...")
            setIsDisabled(true);
            return { toastId: id }
        },

        onSuccess: (_data, _vars, res) => {
            toast.success("Workflow created!", {
                id: res.toastId
            });
            setIsDisabled(false);
            utils.workflow.getMany.invalidate();
        },

        onError: (error, _vars, res) => {
            toast.error("Error creating a workflow. Please try again later.", {
                id: res?.toastId
            });
            setIsDisabled(false);
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderThree />
            </div>
        )
    }
    if (isError || data === undefined) {
        return (
            <EmptyState
                title="There has been a error"
                message={error?.message || 'Cannot find workflows. Please try again later.'}
            />
        )
    } else if (data.length === 0) {
        return (
            <EmptyState
                title="No workflows found"
                message="Create a workflow now to start you automation journey." />                
        )
    }

    return (
        <div className="flex w-full flex-col gap-8 px-4 pb-10 pt-6 lg:px-8">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-2xl font-bold text-foreground">Workflows</p>
                    <p className="text-base font-medium text-muted-foreground">Create and manage your workflows</p>
                </div>
                <Button variant="default" disabled={isDisabled} className="flex w-full items-center justify-center gap-2 rounded-lg border border-black bg-blue-600 font-semibold text-white shadow-lg hover:bg-blue-500 sm:w-auto"
                    onClick={() => createWorkflow.mutate()}>
                    <Plus /> New workflow
                </Button>
            </div>
            <div className="flex w-full flex-col gap-4">
                {data?.map((workflow, idx) => (
                    <Link href={`/workflows/${workflow.id}`} key={idx}>
                        <WorkflowEntity
                            name={workflow.name}
                            createdAt={workflow.createdAt}
                            updatedAt={workflow.updatedAt}
                            onDelete={() => { }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default WorkflowComponent;