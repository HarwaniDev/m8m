"use client"

import { useSuspenseExecutions } from "~/app/hooks/use-executions"
import { formatDistanceToNow } from "date-fns"
import EmptyState from "~/components/ui/custom/empty-state";
import Link from "next/link";
import ExecutionComponent from "~/components/ui/custom/execution-component";
import { ExecutionStatus } from "generated/prisma";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();
    const getStatusIcon = (status: ExecutionStatus) => {
        switch (status) {
            case ExecutionStatus.SUCCESS:
                return <CheckCircle2Icon className="size-5 text-green-600 h-6 w-6 sm:h-7 sm:w-7" />
            case ExecutionStatus.FAILED:
                return <XCircleIcon className="size-5 text-red-600 h-6 w-6 sm:h-7 sm:w-7" />
            case ExecutionStatus.RUNNING:
                return <Loader2Icon className="size-5 text-blue-600 h-6 w-6 sm:h-7 sm:w-7 animate-spin" />
        }
    }
    return (

        <div className="w-full flex flex-col h-full gap-8 px-4 pb-10 pt-6 lg:px-8">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-2xl font-bold text-foreground">Executions</p>
                    <p className="text-base font-medium text-muted-foreground">View your workflow execution history</p>
                </div>

            </div>
            <div className="flex flex-1 w-full flex-col gap-4">
                {executions[0].length > 0 ? executions[0].map((execution, idx) => (
                    <Link href={`/executions/${execution.id}`} key={idx}>
                        <ExecutionComponent
                            workflowName={execution.workflow.name}
                            startedAt={formatDistanceToNow(execution.startedAt)}
                            Icon={getStatusIcon(execution.status)}
                            status={execution.status}
                            startedAtDate={execution.startedAt}
                            completedAtDate={execution.completedAt}
                        />
                    </Link>
                )) : (
                    <EmptyState title="No executions found" message="Get started by running your first workflow" />
                )}
            </div>
        </div>
    )
}