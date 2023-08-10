import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import { nodes as initialNodes, edges as initialEdges } from './Nodes/initial-elements';
import CustomNode from './Nodes/CustomNode';
import 'reactflow/dist/style.css';
import './Nodes/overview.css';
import { get_all_tables } from './Nodes/Scripts';
import { generateTableNodes, generateTableEdges, nodeMaker, edgeMaker } from './Nodes/SelectedNodes';

const proOptions = { hideAttribution: true };

const nodeTypes = {
  custom: (props) => <CustomNode {...props} onSchemaChange={handleSchemaChange} />,
};

let new_nodes = [];
let new_edges = [];

const minimapStyle = {
  height: 120,
};

const handleSchemaChange = async (selectedValue) => {
  console.log('Selected Schema:', selectedValue);

  try {
    // Send a request to the URL to get all tables in the selected schema
    const list_of_tables = await get_all_tables(selectedValue);

    // Fetch the URL and then pass data to generateTableNodes and generateTableEdges
    console.log('Data:', list_of_tables);
    const tableNodes = generateTableNodes(list_of_tables);
    const tableEdges = generateTableEdges();

    const Nodes = nodeMaker(tableNodes);
    const Edges = edgeMaker(tableEdges);

    new_nodes = Nodes;
    new_edges = Edges;

    console.log('Updated nodes:', new_nodes);
    console.log('Updated edges:', new_edges);

  } catch (error) {
    console.error('Error fetching tables:', error);
  }
};

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [updatedNodes, setUpdatedNodes] = useState([]);
  const [updatedEdges, setUpdatedEdges] = useState([]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  useEffect(() => {
    if (new_nodes.length > 0) {
      // setUpdatedNodes(new_nodes);
      setNodes(new_nodes);
      new_nodes = []; // Reset the variable after updating the state
    }
    if (new_edges.length > 0) {
      // setUpdatedEdges(new_edges);
      setEdges(new_edges);
      new_edges = []; // Reset the variable after updating the state
    }
  }, [new_nodes, new_edges]);

  // useEffect(() => {
  //   if (updatedNodes.length > 0) {
  //     setNodes(updatedNodes);
  //     setUpdatedNodes([]); // Reset the updated nodes
  //   }
  //   if (updatedEdges.length > 0) {
  //     setEdges(updatedEdges);
  //     setUpdatedEdges([]); // Reset the updated edges
  //   }
  // }, [updatedNodes, updatedEdges, setNodes, setEdges]);

  // const updateEdgeLabel = () => {
  //   const sourceNode = nodes.find((node) => node.id === 'custom_selection');
  //   const selectedImeiData = sourceNode.data.selects[sourceNode.data.selects[Object.keys(sourceNode.data.selects)[0]]];
  //   const edge = edges.find((edge) => edge.source === 'custom_selection' && edge.target === 'custom_output');
  //   edge.label = selectedImeiData ? `From Node ${selectedImeiData.Imei}` : 'Select an IMEI';
  //   setEdges([...edges]);
  // };

  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
      edge.type = edgeType;
    }

    return edge;
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default OverviewFlow;
