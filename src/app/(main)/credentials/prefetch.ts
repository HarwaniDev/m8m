import "server-only";

import { api } from "~/trpc/server";

export const prefetchCredentials = async () => {
    await api.credential.getMany.prefetch();
};

export const prefetchCredential = async (id: string) => {
    await api.credential.getOne.prefetch({ id });
}

