"use client"
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, type Node, type Edge, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '~/trpc/react';
import { LoaderThree } from '~/components/ui/loader';
import EmptyState from '~/components/ui/custom/empty-state';
import { nodeComponents } from '~/config/node-component';
import { AddNodeButton } from './add-node-button';

export default function EditorComponent({ workflowId }: { workflowId: string }) {
    const { data: workflow, isLoading, error } = api.workflow.getOne.useQuery({ id: workflowId });

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // Update nodes and edges when workflow data loads
    useEffect(() => {
        if (workflow) {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
        }
    }, [workflow]);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot || [])),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot || [])),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot || [])),
        [],
    );

    if (isLoading) {
        return <div className='flex items-center justify-center h-full'>
            <LoaderThree />
        </div>
    }

    if (error || !workflow) {
        return (
            <EmptyState
                title="Workflow not found"
                message={error?.message || 'The workflow you are looking for does not exist.'}
            />
        );
    }

    return (
        <div className='size-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeComponents} 
                >
                <Background />
                <Controls />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
