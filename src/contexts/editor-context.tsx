"use client"

import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"
import { createContext, useContext, useState, type ReactNode } from "react"

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
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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