import "./App.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { CanvasWrapper } from "./components/Canvas/Canvas";
import { useState } from "react";
import { Toast } from "./components/Shared/Toast";
import { useWorkflow } from "./hooks/useWorkflow";
import { usePathfinder } from "./hooks/usePathfinder";
import { ChatSidebar } from "./components/AI/ChatSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "./store/aiSlice";
import { Sparkles } from "lucide-react";
import { useGraphQuery } from "./hooks/useGraphQuery";

function App() {
  const { nodes, edges, setRunningState, syncGraph, nodeTypes } = useWorkflow();
  const [toast, setToast] = useState(null);
  const [executionOutput, setExecutionOutput] = useState(null);
  const dispatch = useDispatch();
  const isAiOpen = useSelector((state) => state.ai?.isOpen);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { handleRunAutomation, handleSaveGraph, handleLoadGraph } =
    usePathfinder(
      nodes,
      edges,
      showToast,
      setRunningState,
      setExecutionOutput,
      syncGraph,
      nodeTypes,
    );

  useGraphQuery({ nodeTypes, syncGraph, enabled: true });

  return (
    <div className="flex h-screen bg-gray-900 text-white w-full overflow-hidden relative">
      {/* Toast Notification */}
      <Toast message={toast?.message} type={toast?.type} />

      {/* Sidebar Area */}
      <Sidebar />

      {/* Canvas Area */}
      <div className="flex-1 relative flex flex-col w-full h-full">
        <div className="h-16 border-b border-white/20 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-md">
          <h2 className="font-semibold text-lg text-gray-200">
            Visual Workflow
          </h2>
          <div className="flex gap-3">
            {!isAiOpen && (
              <button
                onClick={() => dispatch(openSidebar())}
                className="bg-slate-800/80 border border-white/10 hover:bg-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Sparkles size={16} className="text-blue-300" />
                AI Assistant
              </button>
            )}
            <button
              onClick={handleLoadGraph}
              className="bg-gray-700/80 border border-white/20 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Load Graph
            </button>
            <button
              onClick={handleSaveGraph}
              className="bg-gray-700/80 border border-white/20 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Save Graph
            </button>
            <button
              onClick={handleRunAutomation}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Run Automation
            </button>
          </div>
        </div>
        <div className="flex-1 w-full bg-gray-800/50 relative flex flex-col">
          <div className="relative flex-1">
            <CanvasWrapper />
          </div>

          {/* Execution Output Container at the bottom */}
          {executionOutput && (
            <div className="min-h-[120px] border-t border-white/20 bg-gray-950 flex items-center justify-center shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] relative p-6">
              <button
                onClick={() => setExecutionOutput(null)}
                className="absolute top-2 right-4 text-xs text-gray-500 hover:text-white transition-colors"
              >
                Close
              </button>

              {executionOutput.status === "running" && (
                <div className="text-blue-400 animate-pulse text-sm">
                  جاري التنفيذ...
                </div>
              )}

              {executionOutput.status === "error" && (
                <div className="text-red-400 text-sm">
                  حدث خطأ أو تعذر الاتصال بالخادم.
                </div>
              )}

              {executionOutput.status === "success" && executionOutput.data && (
                <div
                  style={{
                    color:
                      executionOutput.data.color ||
                      executionOutput.data.Color ||
                      "#ffffff",
                    fontSize: `${executionOutput.data.font_size || executionOutput.data.fontSize || executionOutput.data.size || 24}px`,
                    fontWeight: "bold",
                  }}
                >
                  {executionOutput.data.log ||
                    executionOutput.data.text ||
                    executionOutput.data.message ||
                    "بدون نص"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAiOpen && (
        <ChatSidebar
          showToast={showToast}
          onRunAutomation={handleRunAutomation}
        />
      )}
    </div>
  );
}

export default App;
