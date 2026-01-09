'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    ConnectionLineType,
    Node,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import TableNode from './TableNode';

// Register custom node types
const nodeTypes = {
    table: TableNode,
};

// --- Auto-Layout Logic ---
const getLayoutedElements = (nodes: any[], edges: any[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 200;
    const nodeHeight = 100;

    dagreGraph.setGraph({ rankdir: 'TB', ranksep: 50, nodesep: 50 }); // TB = Top to Bottom

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

interface InteractiveDiagramProps {
    data: {
        nodes: any[];
        edges: any[];
    };
    title?: string;
}

export function InteractiveDiagram({ data, title }: InteractiveDiagramProps) {
    // 1. Prepare Nodes/Edges for React Flow
    const initialNodes: Node[] = data.nodes.map((n) => ({
        id: n.id,
        type: n.type || 'default', // 'table' triggers custom node, 'default' is standard bubble
        data: {
            label: n.label,
            details: n.details
        },
        position: { x: 0, y: 0 }, // Initial pos, will be fixed by layout
    }));

    const initialEdges: Edge[] = data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        type: 'smoothstep', // Gives right-angle connectors
    }));

    // 2. Calculate Layout
    const layout = useMemo(() => getLayoutedElements(initialNodes, initialEdges), [data]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layout.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layout.edges);

    return (
        <div className="space-y-2">
            {title && <h4 className="font-semibold text-[var(--text-secondary)]">{title}</h4>}
            <div className="h-[500px] w-full border border-[var(--border)] rounded-lg bg-[var(--background-tertiary)] shadow-inner">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                >
                    <Background color="#555" gap={16} variant={BackgroundVariant.Dots} />
                    <Controls className="bg-[var(--surface)] text-black border-2 border-[var(--border)]" />
                </ReactFlow>
            </div>
        </div>
    );
}
