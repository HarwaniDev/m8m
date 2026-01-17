"use client"
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus } from "generated/prisma";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSuspenseExecution } from "~/app/hooks/use-executions";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

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

export const ExecutionView = ({ executionId }: { executionId: string }) => {
    const [execution] = useSuspenseExecution(executionId);
    const [showStackTrace, setShowStackTrace] = useState(false);
    const duration = execution.completedAt && Math.round((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000);

    return (
        <Card className="rounded-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                        <CardTitle>
                            {execution.status}
                        </CardTitle>
                        <CardDescription>
                            {execution.workflow.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Workflow
                        </p>
                        <Link
                            prefetch
                            className="text-sm hover:underline text-blue-600"
                            href={`/workflows/${execution.workflowId}`}>
                            {execution.workflow.name}
                        </Link>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Status
                        </p>
                        <p className="text-sm">
                            {execution.status}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Status
                        </p>
                        <p className="text-sm">
                            {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                        </p>
                    </div>
                    {execution.completedAt &&
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Status
                            </p>
                            <p className="text-sm">
                                {formatDistanceToNow(execution.completedAt, { addSuffix: true })}
                            </p>
                        </div>}
                    {duration &&
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Duration
                            </p>
                            <p className="text-sm">
                                {duration}s
                            </p>
                        </div>}
                </div>
                {execution.error && (
                    <div className="p-4 bg-red-50 rounded-lg space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-red-900 md-2">
                                Error
                            </p>
                            <p className="text-sm text-red-800">
                                {execution.error}
                            </p>
                        </div>
                        {execution.errorStack && (
                            <Collapsible
                                open={showStackTrace}
                                onOpenChange={setShowStackTrace}
                            >
                                <CollapsibleTrigger className="text-red-900 rounded-lg cursor-pointer">
                                    {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                                    <pre>
                                        {execution.errorStack}
                                    </pre>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </div>
                )}
                {execution.output && (
                    <div className="mt-6 p-4 rounded-lg bg-muted">
                        <p className="text-sm font-medium mb-2">
                            Output
                        </p>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(execution.output, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}