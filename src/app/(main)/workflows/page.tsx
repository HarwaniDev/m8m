"use client"
import { api } from "~/trpc/react";
import { Workflow } from "lucide-react";
import EntityComponent from "~/components/ui/custom/entity-component";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { LoaderThree } from "~/components/ui/loader";
import EmptyState from "~/components/ui/custom/empty-state";
import { formatDistanceToNow } from "date-fns";
import { EntityHeader } from "~/components/ui/custom/entity-header";

const WorkflowComponent = () => {
    const utils = api.useUtils();

    // TODO:- add authentication check
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
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={() => createWorkflow.mutate()}
                buttonTitle="New workflow"
                disabled={isDisabled}
            />
            <div className="flex w-full flex-col gap-4">
                {data.map((workflow, idx) => (
                    <Link href={`/workflows/${workflow.id}`} key={idx}>
                        <EntityComponent
                            name={workflow.name}
                            createdAt={formatDistanceToNow(workflow.createdAt)}
                            updatedAt={formatDistanceToNow(workflow.updatedAt)}
                            Icon={Workflow}
                            onDelete={() => { }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default WorkflowComponent;