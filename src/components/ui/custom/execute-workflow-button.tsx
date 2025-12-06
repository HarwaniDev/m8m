"use client"
import { FlaskConicalIcon } from "lucide-react"
import { Button } from "../button"
import { api } from "~/trpc/react"
import { toast } from "sonner"

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
    const executeMutation = api.workflow.execute.useMutation({
        onMutate: () => {
            const id = toast.loading("Executing the workflow", {
                duration: 3
            });
            return {
                toastId: id
            }
        },
        onSuccess: (data, vars, res) => {
            toast.success("Workflow executed successfully!", {
                id: res.toastId
            })
        },
        onError: (error, vars, res) => {
            toast.error("There was an error executing the workflow. Please try again!", {
                id: res?.toastId
            })
        }

    })
    const handleExecute = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (executeMutation.isPending) {
            return;
        }
        
        executeMutation.mutate({
            workflowId: workflowId
        });
    }
    return (
        <Button size="lg" type="button" className="border-black bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 font-semibold cursor-pointer" onClick={handleExecute} disabled={executeMutation.isPending}>
            <FlaskConicalIcon className="size-4 text-white" />
            Execute Workflow <br />
            TODO: make sure to handle two inngest calls
        </Button>
    )
}

export default ExecuteWorkflowButton;