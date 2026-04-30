import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Layers, ServerOff } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNodeTypes } from "../../store/workflowSlice";

const mockData = [
  {
    type: "Log",
    label: "Log",
    color: "#3b82f6",
    fields: [{ name: "text", type: "string", label: "Text" }],
  },
  {
    type: "Delay",
    label: "Delay",
    color: "#eab308",
    fields: [{ name: "time", type: "integer", label: "Time" }],
  },
  {
    type: "Theme",
    label: "Theme Color",
    color: "#ec4899",
    fields: [{ name: "color", type: "color", label: "Color" }],
  },
];

const fetchNodeTypes = async () => {
  try {
    const { data } = await api.get("/api/node-types");
    // Handle the new response format: { nodeTypes: [...] }
    const nodes = data?.nodeTypes || (Array.isArray(data) ? data : []);

    // If the backend returns an empty array or an invalid response, fallback to mock data
    if (nodes.length === 0) {
      console.warn(
        "Backend returned empty or invalid data, using fallback mock data.",
      );
      return mockData;
    }

    return nodes;
  } catch (err) {
    console.warn("Backend not found or timeout, using fallback mock data.");
    return mockData;
  }
};

export const Sidebar = () => {
  const dispatch = useDispatch();
  const {
    data: nodeTypes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nodeTypes"],
    queryFn: fetchNodeTypes,
  });

  useEffect(() => {
    if (Array.isArray(nodeTypes)) {
      dispatch(setNodeTypes(nodeTypes));
    }
  }, [nodeTypes, dispatch]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r border-white/20 p-4 shrink-0 bg-gray-800 flex flex-col gap-4 z-20 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="text-blue-400" />
        <h1 className="text-xl font-bold text-gray-100">Node Types</h1>
      </div>

      {isLoading && (
        <div className="text-sm text-gray-400">Loading nodes...</div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm z-30 flex gap-2 items-center font-medium shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <ServerOff size={16} />
          Server Offline
        </div>
      )}

      <div className="flex flex-col gap-3">
        {Array.isArray(nodeTypes) &&
          nodeTypes.map((node) => (
            <motion.div
              key={node.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onDragStart={(e) => onDragStart(e, node)}
              draggable
              className="p-3 rounded border border-white/10 bg-white/5 backdrop-blur-md cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
              style={{ borderLeftColor: node.color, borderLeftWidth: "4px" }}
            >
              <span className="font-medium text-sm text-gray-200">
                {node.label}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
};
