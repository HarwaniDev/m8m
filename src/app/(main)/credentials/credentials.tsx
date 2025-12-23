"use client"

import { CreditCard } from "lucide-react";
import { useRemoveCredential, useSuspenseCredentials } from "~/app/hooks/use-credentials"
import EntityComponent from "~/components/ui/custom/entity-component";
import { EntityHeader } from "~/components/ui/custom/entity-header";
import { formatDistanceToNow } from "date-fns"
import EmptyState from "~/components/ui/custom/empty-state";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CredentialType } from "generated/prisma";

export const CredentialsList = () => {
    const router = useRouter();
    const credentials = useSuspenseCredentials();
    const removeCredential = useRemoveCredential();

    const logo: Record<CredentialType, string> = {
        [CredentialType.GEMINI]: "/gemini.svg"
    };

    return (
        <div className="flex w-full flex-col gap-8 px-4 pb-10 pt-6 lg:px-8">
            <EntityHeader
                title="Credentials"
                description="Create and manage your credentials"
                onNew={() => { router.push("/credentials/new") }}
                buttonTitle="Add credential"
            />
            <div className="flex w-full flex-col gap-4">
                {credentials[0].length > 0 ? credentials[0].map((credential, idx) => (
                    <Link href={`/credentials/${credential.id}`} key={idx}>
                        <EntityComponent
                            name={credential.name}
                            createdAt={formatDistanceToNow(credential.createdAt)}
                            updatedAt={formatDistanceToNow(credential.updatedAt)}
                            Icon={logo[credential.type]}
                            onDelete={() => { removeCredential.mutate({ id: credential.id }) }}
                        />
                    </Link>
                )) : (
                    <EmptyState title="No credentials found" message="You haven't created any credentials yet" />
                )}
            </div>
        </div>
    )
}