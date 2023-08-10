import { Position } from 'reactflow';

// export const generateTableNodes = (ListofTables) => {

//     const tableNodes = [];
//     tableNodes.push({
//         id: 'tables',
//         type: 'custom',
//         data: {
//           label: ListofTables,
//         },
//         position: { x: 100, y: 100},
//         sourcePosition: Position.Right,
//         targetPosition: Position.Right,
//         style: {
//             background: "#00FF00",
//           }
//     });

//     return tableNodes;
// }

// export const generateTableNodes = (ListofTables) => {
//   const tableNodes = ListofTables.map((tableName) => ({
//     id: `table_${tableName}`,
//     type: 'table', // Assuming you have a 'table' node type
//     data: {
//       label: tableName,
//     },
//     position: { x: 100, y: 100 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Right,
//     style: {
//       background: '#00FF00',
//     },
//     draggable: true, // Enable drag-and-drop
//     onDragStart: (event) => {
//       // Set the tableId as data for the drag event
//       event.dataTransfer.setData('tableId', `table_${tableName}`);
//     },
//   }));

//   return tableNodes;
// };

export const generateTableNodes = (ListofTables) => {
  const tableNodes = ListofTables.map((tableName, index) => ({
    id: `table_${tableName}`,
    type: 'table', // Assuming you have a 'table' node type
    data: {
      label: tableName,
    },
    position: { x: 100, y: 100 + 50 * index }, // Increment y by 50 for each table
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: {
      background: '#00FF00',
    },
    draggable: true, // Enable drag-and-drop
    onDragStart: (event) => {
      // Set the tableId as data for the drag event
      event.dataTransfer.setData('tableId', `table_${tableName}`);
    },
  }));

  return tableNodes;
};



export const generateTableEdges = () => {
    const tableEdges = [];
    // Generate edge between tables and custom_selection node
    tableEdges.push({
        id: 'table_custom_selection',
        source: 'custom_selection',
        target: 'tables',
    });

    return tableEdges;
}

export const nodeMaker = (table_node) => {
    const nodes = [
        {
          id: 'custom_selection',
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
            },
          },
        },
        {
          id: 'table_selection',
          type: 'custom',
          position: { x: 200, y: 0 },
          data: {
            selectedTables: [],
          },
        },
        ...table_node,
      ];
      return nodes;
}

export const edgeMaker = (table_edge) => {
    const edges = [
        ...table_edge,
      ];
      return edges;
}