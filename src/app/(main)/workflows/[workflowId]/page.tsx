

interface PageProps {
    params: Promise<{
        workflowId: string
    }>
}

const WorkflowComponent = async ({ params }: PageProps) => {
    const { workflowId } = await params;
    return (
        <>
            {workflowId}
        </>
    )
}

export default WorkflowComponent;