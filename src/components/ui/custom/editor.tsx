"use client"
import { useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, Panel, type NodeChange, type EdgeChange, type Connection, type ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '~/trpc/react';
import { LoaderThree } from '~/components/ui/loader';
import EmptyState from '~/components/ui/custom/empty-state';
import { nodeComponents } from '~/config/node-component';
import { AddNodeButton } from './add-node-button';
import { useEditor } from '~/contexts/editor-context';

export default function EditorComponent({ workflowId }: { workflowId: string }) {
    const { data: workflow, isLoading, error } = api.workflow.getOne.useQuery({ id: workflowId });
    const { nodes, edges, setNodes, setEdges, setReactFlowInstance } = useEditor();

    // Update nodes and edges when workflow data loads
    useEffect(() => {
        if (workflow) {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
        }
    }, [workflow, setNodes, setEdges]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes(applyNodeChanges(changes, nodes));
        },
        [nodes, setNodes],
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges(applyEdgeChanges(changes, edges));
        },
        [edges, setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges(addEdge(params, edges));
        },
        [edges, setEdges],
    );

    const onInit = useCallback(
        (instance: ReactFlowInstance) => {
            setReactFlowInstance(instance);
        },
        [setReactFlowInstance],
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
                    onInit={onInit}
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
