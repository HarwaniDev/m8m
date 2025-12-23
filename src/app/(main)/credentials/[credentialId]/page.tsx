import { HydrateClient } from "~/trpc/server";
import { CredentialView } from "../new/credential";
import { prefetchCredential } from "../prefetch";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { LoaderThree } from "~/components/ui/loader";

interface PageProps {
    params: Promise<{
        credentialId: string
    }>
};

const CredentialPage = async ({ params }: PageProps) => {
    // TODO: add auth check
    const { credentialId } = await params;
    prefetchCredential(credentialId)
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<>error</>}>
                        <Suspense fallback={<div className="flex items-center justify-center h-full"> <LoaderThree /> </div>}>
                            <CredentialView credentialId={credentialId} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
};

export default CredentialPage;