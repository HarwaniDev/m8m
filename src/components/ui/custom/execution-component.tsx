import type { JSX } from "react";
const ExecutionComponent = ({
    workflowName,
    status,
    startedAt,
    completedAtDate,
    startedAtDate,
    Icon,
}: {
    startedAtDate: Date;
    completedAtDate: Date | null;
    workflowName: string;
    startedAt: string;
    status: string;
    Icon: JSX.Element;
}) => {
    const duration = completedAtDate && Math.round(completedAtDate.getTime() - startedAtDate.getTime()) / 1000;
    return (
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer">
            <div className="flex w-full flex-1 items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 sm:h-14 sm:w-14">
                    {Icon}
                </span>
                <div className="flex min-w-0 flex-col">
                    <p className="truncate text-base font-semibold text-foreground md:text-lg">{workflowName}</p>
                    <p className="text-sm text-muted-foreground">Status: {status} • Started {startedAt} ago {duration && <> • Took {duration} seconds </>}</p>
                </div>
            </div>
            <div className="flex w-full items-center justify-end sm:w-auto">
            </div>
        </div>
    )
}

export default ExecutionComponent;