import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
  nodeTypes: [],
  isRunning: false,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes(state, action) {
      state.nodes = action.payload;
    },
    addNode(state, action) {
      state.nodes.push(action.payload);
    },
    updateNodeData(state, action) {
      const { id, key, value } = action.payload;
      const node = state.nodes.find((n) => n.id === id);
      if (node && node.data) {
        node.data[key] = value;
      }
    },
    setEdges(state, action) {
      state.edges = action.payload;
    },
    addEdge(state, action) {
      state.edges.push(action.payload);
    },
    setNodeTypes(state, action) {
      state.nodeTypes = action.payload;
    },
    setIsRunning(state, action) {
      state.isRunning = action.payload;
    },
    setGraph(state, action) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.lastLoaded = Date.now();
    }
  },
});

export const { setNodes, addNode, updateNodeData, setEdges, addEdge, setNodeTypes, setIsRunning, setGraph } = workflowSlice.actions;
export default workflowSlice.reducer;
