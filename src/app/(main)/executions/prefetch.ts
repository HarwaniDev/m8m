import "server-only";

import { api } from "~/trpc/server";

export const prefetchExecutions = async () => {
    await api.execution.getMany.prefetch();
};

export const prefetchExecution = async (id: string) => {
    await api.execution.getOne.prefetch({ id });
}

