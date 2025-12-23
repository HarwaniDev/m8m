"use client"

import { CreditCard } from "lucide-react";
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from "~/app/hooks/use-credentials"
import EntityComponent from "~/components/ui/custom/entity-component";
import { EntityHeader } from "~/components/ui/custom/entity-header";
import { formatDistanceToNow } from "date-fns"
import EmptyState from "~/components/ui/custom/empty-state";

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();
    const addCredential = useCreateCredential();
    const removeCredential = useRemoveCredential();

    return (
        <div className="flex w-full flex-col gap-8 px-4 pb-10 pt-6 lg:px-8">
            <EntityHeader
                title="Credentials"
                description="Create and manage your credentials"
                onNew={() => { addCredential.mutate({ name: "test", type: "GEMINI", value: "test" }) }}
                buttonTitle="Add credential"
                disabled={addCredential.isPending}
            />
            <div className="flex w-full flex-col gap-4">
                {credentials[0].length > 0 ? credentials[0].map((credential, idx) => (

                    <EntityComponent
                        key={idx}
                        name={credential.name}
                        createdAt={formatDistanceToNow(credential.createdAt)}
                        updatedAt={formatDistanceToNow(credential.updatedAt)}
                        Icon={CreditCard}
                        onDelete={() => { removeCredential.mutate({ id: credential.id }) }}
                    />
                )) : (
                    <EmptyState title="No credentials found" message="You haven't created any credentials yet" />
                )}
            </div>
        </div>
    )
}