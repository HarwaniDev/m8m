import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { CredentialsList } from "./credentials";
import { prefetchCredentials } from "./prefetch";
import { ErrorBoundary } from "react-error-boundary"
import { LoaderThree } from "~/components/ui/loader";
const CredentialComponent = async () => {
    prefetchCredentials();

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<>error...</>}>
                <Suspense fallback={<div className="flex items-center justify-center h-full"> <LoaderThree /> </div>}>
                    <CredentialsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}


export default CredentialComponent;