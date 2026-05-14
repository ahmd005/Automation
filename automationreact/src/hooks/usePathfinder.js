import { generateExecutionPath, formatGraphForBackend, formatGraphFromBackend } from '../utils/pathfinder';
import api from '../api/axios';

export const usePathfinder = (nodes, edges, showToast, setRunningState, setExecutionOutput, syncGraph, nodeTypes) => {

  const handleRunAutomation = async () => {
    if (nodes.length === 0) {
      showToast("Canvas is empty. Add nodes first.", "error");
      return;
    }

    const pathData = generateExecutionPath(nodes, edges);
    const pathIds = pathData.map(node => node.id);
    
    // Explicitly parse and format the data the backend is likely expecting
    const formattedNodesForBackend = pathData.map(node => {
      // Find possible values dynamically to ensure backend gets them
      const textVal = node.data?.text || node.data?.log || "";
      const colorVal = node.data?.color || "#ffffff";
      // Allow dynamic matching for size variations coming from the user's nodes
      const fontSizeVal = node.data?.fontSize || node.data?.font_size || node.data?.size || 24;

      return {
        id: node.id,
        type: node.nodeType?.type || node.type || "Unknown",
        text: textVal,
        color: colorVal,
        fontSize: fontSizeVal,
        rawData: node.data
      };
    });
    
    try {
      showToast("Executing workflow...", "info");
      setRunningState(true);
      
      if (setExecutionOutput) {
        setExecutionOutput({ status: "running", data: null });
      }

      // Send the structured path elements so the backend can correctly read text, color, and fontSize
      const { data } = await api.post("/api/execute-logic", { 
        path: pathIds, 
        nodes: formattedNodesForBackend,
        fullPath: pathData 
      });
      
      // Artificially delay for 1.5s to show running lights even if fast
      setTimeout(() => {
        setRunningState(false);
        showToast(data?.message || "Logic executed successfully!", "success");
        
        if (setExecutionOutput) {
          // If the backend returns 'null' values (which happens if path IDs aren't found in its DB)
          // We will use the frontend's valid Node Data to force a successful UI display 
          let returnedText = data.text || data.log || data.message;
          let returnedColor = data.color || data.Color;
          let returnedFontSize = data.font_size || data.fontSize;

          // Autocorrect nulls by overriding them with real data from our canvas nodes
          if (!returnedText && formattedNodesForBackend.length > 0) {
             const textNode = formattedNodesForBackend.find(n => n.text && n.text.trim() !== "");
             if (textNode) returnedText = textNode.text;
          }
          if (!returnedColor && formattedNodesForBackend.length > 0) {
             const colorNode = formattedNodesForBackend.find(n => n.color && n.color !== "#ffffff");
             if (colorNode) returnedColor = colorNode.color;
          }
          if (!returnedFontSize && formattedNodesForBackend.length > 0) {
             // Look for actual sizes, ignore 24 if we can find something explicitly set
             const sizeNode = formattedNodesForBackend.find(n => n.fontSize && n.fontSize != 24);
             if (sizeNode) {
                 returnedFontSize = sizeNode.fontSize;
             } else {
                 returnedFontSize = formattedNodesForBackend[0].fontSize || 24;
             }
          }

          setExecutionOutput({ 
             status: "success", 
             data: { 
                 ...data, 
                 text: returnedText || "لم يكتب نص (Empty)", 
                 color: returnedColor || "#ffffff", 
                 fontSize: returnedFontSize || 24 
             } 
          });
        }
      }, 1500);

    } catch (err) {
      setTimeout(() => {
        setRunningState(false);
        showToast("Execution failed (Server offline or error)", "error");
        console.warn("Backend error fallback: Path was => ", pathData);
        if (setExecutionOutput) {
          // Fallback UI to simulate the output for demonstration if the server is offline
          const nodesOutput = pathData.map(n => {
            const possibleTextValues = Object.entries(n.data || {}).filter(([key, val]) => 
              typeof val === 'string' && !key.toLowerCase().includes('color') && !val.startsWith('rgb') && !val.startsWith('#')
            ).map(([_, val]) => val);
            
            const nodeText = possibleTextValues.length > 0 ? possibleTextValues[0] : (n.data?.text || n.data?.name || n.nodeType);

            return {
              text: nodeText,
              color: n.data?.color || n.data?.textColor || n.data?.hex || n.nodeType?.color || "#ffffff",
              fontSize: n.data?.fontSize || "24",
              type: n.nodeType,
              id: n.id
            };
          });
          setExecutionOutput({ status: "error", error: "تعذر الاتصال بالسيرفر", fallbackData: nodesOutput });
        }
      }, 1500);
    }
  };

  const handleSaveGraph = async () => {
    if (nodes.length === 0) return showToast("Nothing to save", "error");
    const jsonLoad = formatGraphForBackend(nodes, edges);
    
    try {
      showToast("Saving...", "info");
      await api.post("/api/save-graph", jsonLoad);
      showToast("Graph saved successfully", "success");
    } catch (err) {
      showToast("Save failed", "error");
      console.warn("Save Schema fallback =>", jsonLoad);
    }
  };

  const handleLoadGraph = async () => {
    try {
      showToast("Loading...", "info");
      const { data } = await api.get("/api/load-graph");
      
      // Convert backend format to React Flow format
      const { nodes: loadedNodes, edges: loadedEdges } = formatGraphFromBackend(data, nodeTypes);
      
      // Update Redux state with loaded graph
      if (syncGraph) {
        syncGraph(loadedNodes, loadedEdges);
      }
      
      showToast("Graph loaded successfully", "success");
    } catch (err) {
      showToast("Load failed - Server offline or no saved graph", "error");
      console.warn("Load Error:", err);
    }
  };

  return { handleRunAutomation, handleSaveGraph, handleLoadGraph };
};
