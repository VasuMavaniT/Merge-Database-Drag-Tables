import React from 'react';
import { MarkerType, Position } from 'reactflow';

export const nodes = [
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
];


export const edges = [
];