"use client"

import { api } from "~/trpc/react";

const workflowComponent = () => {
    const workflows = api.workflow.getMany;
    return (
        <p>
            Workflows
        </p>
    )
}

export default workflowComponent;