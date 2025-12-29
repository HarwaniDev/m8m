import { api } from "~/trpc/react";

export const useSuspenseExecutions = () => {
    return api.execution.getMany.useSuspenseQuery();
};

export const useSuspenseExecution = (id: string) => {
    return api.execution.getOne.useSuspenseQuery({ id });
}