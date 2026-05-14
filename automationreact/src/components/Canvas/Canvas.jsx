import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge as rfAddEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addNode,
  addEdge as addReduxEdge,
  setNodes,
  setEdges,
} from "../../store/workflowSlice";
import { AutomationNode } from "../Nodes/AutomationNode";

const nodeTypes = {
  automation: AutomationNode,
};

const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodesLocal, onNodesChange] = useNodesState([]);
  const [edges, setEdgesLocal, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const dispatch = useDispatch();
  const {
    isRunning,
    lastLoaded,
    nodes: reduxNodes,
    edges: reduxEdges,
  } = useSelector((state) => state.workflow);

  // Automatically update the local Canvas state when a new graph is explicitly loaded via backend API
  useEffect(() => {
    if (lastLoaded) {
      setNodesLocal(reduxNodes || []);
      setEdgesLocal(reduxEdges || []);
    }
  }, [lastLoaded, setNodesLocal, setEdgesLocal]);

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return; // validate self-connection

      const newEdge = { ...params, id: uuidv4() };
      setEdgesLocal((eds) => rfAddEdge(newEdge, eds));
    },
    [setEdgesLocal],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const typeData = event.dataTransfer.getData("application/reactflow");
      if (!typeData) return;

      const nodeTypeData = JSON.parse(typeData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type: "automation",
        position,
        data: { nodeType: nodeTypeData },
      };

      setNodesLocal((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodesLocal],
  );

  // Sync Persistence: Map visual edges dynamically and sync to Redux
  useEffect(() => {
    dispatch(setNodes(nodes));
  }, [nodes, dispatch]);

  useEffect(() => {
    const formattedEdges = edges.map((e) => ({
      ...e,
      animated: isRunning, // Visual Feedback: animated running lights
      style: {
        stroke: isRunning ? "#3b82f6" : "#9ca3af",
        strokeWidth: isRunning ? 3 : 2,
      },
    }));
    dispatch(setEdges(formattedEdges));
  }, [edges, isRunning, dispatch]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges.map((e) => ({
          ...e,
          animated: isRunning,
          style: {
            stroke: isRunning ? "#3b82f6" : "#9ca3af",
            strokeWidth: isRunning ? 3 : 2,
          },
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls
          className="bg-gray-800 border-gray-600 rounded-lg shadow-xl overflow-hidden"
          style={{ display: "flex", flexDirection: "column" }}
        />
      </ReactFlow>
    </div>
  );
};

export const CanvasWrapper = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);
