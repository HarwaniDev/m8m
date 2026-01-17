import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "~/trpc/server";
import { ExecutionView } from "./execution";
import { prefetchExecution } from "../prefetch";
import { Suspense } from "react";
import { LoaderThree } from "~/components/ui/loader";

interface PageProps {
    params: Promise<{
        executionId: string
    }>
};

const ExecutionPage = async ({ params }: PageProps) => {
    const { executionId } = await params;
    prefetchExecution(executionId);
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto w-full max-w-3xl flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<>error...</>}>
                        <Suspense fallback={<div className="flex items-center justify-center h-full"> <LoaderThree /> </div>}>
                            <ExecutionView executionId={executionId} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
}

export default ExecutionPage;