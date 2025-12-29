import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { ExecutionsList } from "./executions";
import { prefetchExecutions } from "./prefetch";
import { ErrorBoundary } from "react-error-boundary"
import { LoaderThree } from "~/components/ui/loader";
const CredentialComponent = async () => {
    prefetchExecutions();

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<>error...</>}>
                <Suspense fallback={<div className="flex items-center justify-center h-full"> <LoaderThree /> </div>}>
                    <ExecutionsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}


export default CredentialComponent;