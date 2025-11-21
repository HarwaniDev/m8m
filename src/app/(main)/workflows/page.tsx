"use client"
import { api } from "~/trpc/react";

const WorkflowComponent = () => {
    const { data, isLoading, isError } = api.workflow.getMany.useQuery({});
    return (
        <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
            <span className="font-bold text-4xl">Workflows</span>
            <div>
                {data?.map((workflow) => (
                    <div key={workflow.id}>
                        <span>{workflow.name}</span>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WorkflowComponent;