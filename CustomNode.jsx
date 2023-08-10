import React, { useState, useEffect } from 'react';
import { Handle, useReactFlow, Position } from 'reactflow';
import jsonData from './Data.json';
import { get_all_schemas } from './Scripts';

function Select({ value, handleId, nodeId, onChange, schemaOptions }) {
  return (
    <div className="custom-node__select">
      <div>Schema</div>
      <select className="nodrag" onChange={onChange} value={value}>
        <option value="">Select Schema</option>
        {console.log("Schema options:", schemaOptions)}
        {/* Getting keys from schemaOptions and map it */}
        {Object.keys(schemaOptions).map((schema) => (
          <option key={schema} value={schema}>
            {schema}
          </option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} id={handleId} />
    </div>
  );
}

function isNodeSelection(nodeid) {
  if (nodeid === 'custom_selection') {
    return true;
  }
  return false;
}

function CustomNode({ id, data, onSchemaChange }) {
  const [selectedImeiData, setSelectedImeiData] = useState(null);
  const [selectedValues, setSelectedValues] = useState(data.selects);
  const [schemaOptions, setSchemaOptions] = useState([]);

  useEffect(() => {
    // Fetch schema options and update state when fetched
    get_all_schemas().then((schemas) => {
      setSchemaOptions(schemas);
    });
  }, []);

  const handleSchemaSelect = (handleId, value) => {
    setSelectedImeiData(jsonData.find((item) => item.Imei.toString() === value));
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [handleId]: value,
    }));

    onSchemaChange(value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const tableId = e.dataTransfer.getData('tableId');
    
    if (tableId) {
      // Add the dropped table to the selectedTables array
      const updatedSelectedTables = [...data.selectedTables, tableId];
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                selectedTables: updatedSelectedTables,
              },
            };
          }
          return node;
        })
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const { setNodes } = useReactFlow();

  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              selects: { ...selectedValues },
            },
          };
        }
        return node;
      })
    );
  }, [id, selectedValues, setNodes]);

  return (
    <>
      <div className="custom-node__body">
        {isNodeSelection(id) && (
          Object.keys(data.selects).map((handleId) => (
            <Select
              key={handleId}
              nodeId={id}
              value={selectedValues[handleId]}
              handleId={handleId}
              onChange={(e) => handleSchemaSelect(handleId, e.target.value)}
              schemaOptions={schemaOptions}
            />
          ))
        )}
        {selectedImeiData && isNodeSelection(id) && (
          <div className="selected-imei-data">
            <p>Brand: {selectedImeiData.Brand}</p>
            <p>Model: {selectedImeiData.Model}</p>
          </div>
        )}

        {id === 'tables' && (
          <div className="selected-imei-data">
            <p>Tables:</p>
            <ul>
              {data.label.map((table, index) => (
                <li
                  key={index}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('tableId', `table_${table}`);
                  }}
                >
                  {table}
                </li>
              ))}
            </ul>
          </div>
        )}

        {id === 'table_selection' && (
          <div
            className="table-selection-drop-target"
          >
            Select Multiple Tables
          </div>
        )}
      </div>
    </>
  );
}

export default CustomNode;
