"use client"

import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type EditorContextType = {
    nodes: Node[],
    edges: Edge[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void,
    reactFlowInstance: ReactFlowInstance | null,
    setReactFlowInstance: (instance: ReactFlowInstance | null) => void,
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);


export const EditorContextProvider = ({ children }: { children: ReactNode }) => {
    const [nodes, setNodesState] = useState<Node[]>([]);
    const [edges, setEdgesState] = useState<Edge[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    // Wrapper functions for better control and potential future logic
    const setNodes = useCallback((newNodes: Node[]) => {
        setNodesState(newNodes);
    }, []);

    const setEdges = useCallback((newEdges: Edge[]) => {
        setEdgesState(newEdges);
    }, []);

    return (
        <EditorContext.Provider value={{ 
            nodes, 
            edges, 
            setNodes, 
            setEdges,
            reactFlowInstance,
            setReactFlowInstance,
        }}>
            {children}
        </EditorContext.Provider>
    )
};


export function useEditor() {
    const context = useContext(EditorContext)
    if (context === undefined) {
        throw new Error("useEditor must be used within a EditorContextProvider")
    }
    return context
}