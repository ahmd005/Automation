// Traverses the graph to generate an ordered linear execution array for the backend.
// Implements DFS (Depth-First Search).
export const generateExecutionPath = (nodes, edges) => {
    if (nodes.length === 0) return [];

    // Find the Start Node(s). They are nodes with no incoming connections (not a target in any edge).
    const targetIds = new Set(edges.map(e => e.target));
    const startNodes = nodes.filter(n => !targetIds.has(n.id));

    if (startNodes.length === 0) {
      console.warn("No start node found (circular dependency or empty graph).");
      // Fallback: just pick the first node in array if everything is connected
      return [nodes[0]];
    }

    const path = [];
    const visited = new Set();
    
    // DFS function to recursively trace paths
    const dfs = (nodeId) => {
      if (visited.has(nodeId)) return; // Prevent cycles
      visited.add(nodeId);
      const nodeObj = nodes.find(n => n.id === nodeId);
      path.push(nodeObj);
      
      const outgoingEdges = edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        dfs(edge.target);
      }
    };

    // Assuming a primary single path, start with the first valid entry node
    dfs(startNodes[0].id);

    return path;
};

// Formats the React Flow graph into the specific JSON schema required by the backend.
export const formatGraphForBackend = (nodes, edges) => {
    // Generate simple integer IDs for the backend if requested, or use mapping to ensure integers
    const idMap = new Map();
    nodes.forEach((n, index) => {
      idMap.set(n.id, index + 1); // map "dndnode_0" to 1, "dndnode_1" to 2, etc.
    });

    const formattedNodes = nodes.map(n => {
        // Clean out nodeType to only send actual input fields
        const cleanData = { ...n.data };
        delete cleanData.nodeType;

        return {
            id: idMap.get(n.id) || n.id,
            type: n.data?.nodeType?.type || n.type || "Unknown",
            x_pos: Math.round(n.position.x),
            y_pos: Math.round(n.position.y),
            data: cleanData // Contains configured dynamic inputs (e.g. { "text": "Hello" })
        };
    });

    const formattedConnections = edges.map(e => ({
        from_node_id: idMap.get(e.source) || e.source,
        to_node_id: idMap.get(e.target) || e.target
    }));

    return {
        nodes: formattedNodes,
        connections: formattedConnections
    };
};

// Converts backend graph format back to React Flow format for UI rendering
export const formatGraphFromBackend = (backendData, nodeTypes = []) => {
    if (!backendData || !backendData.nodes) return { nodes: [], edges: [] };

    const normalizeDataByFields = (rawData, fields = []) => {
        if (!rawData || fields.length === 0) return rawData || {};
        const normalized = { ...rawData };
        const lookup = Object.keys(rawData).reduce((acc, key) => {
            acc[key.toLowerCase()] = key;
            return acc;
        }, {});

        fields.forEach((field) => {
            const targetKey = field.name;
            const sourceKey = lookup[targetKey.toLowerCase()];
            if (sourceKey && sourceKey !== targetKey) {
                normalized[targetKey] = rawData[sourceKey];
            }

            if (normalized[targetKey] === undefined && field.type === "color") {
                const colorKey = Object.keys(rawData).find((key) =>
                    key.toLowerCase().includes("color"),
                );
                if (colorKey) {
                    normalized[targetKey] = rawData[colorKey];
                }
            }
        });

        return normalized;
    };

    // Create a mapping from backend integer IDs to React Flow string IDs
    const idMap = new Map();
    backendData.nodes.forEach((n) => {
        // Map backend ID to dndnode format
        idMap.set(n.id, `dndnode_${n.id - 1}`);
    });

    // Convert nodes from backend format to React Flow format
    const reactFlowNodes = backendData.nodes.map(n => {
        let fullNodeType = nodeTypes.find(type => type.type === n.type);
        
        if (!fullNodeType) {
            // Synthesize nodeType if it isn't registered in the frontend yet
            const synthesizedFields = Object.keys(n.data || {}).map((key) => {
                let fieldType = "string";
                const val = n.data[key];
                if (typeof val === "number" || (!isNaN(val) && val !== "")) fieldType = "integer";
                if (key.toLowerCase().includes("color") || String(val).startsWith("#") || String(val).startsWith("rgb")) fieldType = "color";
                
                return { name: key, type: fieldType, label: key.charAt(0).toUpperCase() + key.slice(1) };
            });
            
            fullNodeType = { 
                type: n.type, 
                label: n.type, 
                color: "#9ca3af", // default gray if unknown
                fields: synthesizedFields 
            };
        }

        const normalizedData = normalizeDataByFields(n.data || {}, fullNodeType?.fields || []);

        return {
            id: idMap.get(n.id) || `dndnode_${n.id - 1}`,
            type: "automation", // Required by React Flow
            position: {
                x: n.x_pos || 0,
                y: n.y_pos || 0
            },
            data: {
                ...normalizedData,
                nodeType: fullNodeType
            }
        };
    });

    // Convert connections from backend format to React Flow format
    const reactFlowEdges = (backendData.connections || []).map((conn, index) => ({
        id: `edge-${conn.from_node_id}-${conn.to_node_id}`,
        source: idMap.get(conn.from_node_id) || `dndnode_${conn.from_node_id - 1}`,
        target: idMap.get(conn.to_node_id) || `dndnode_${conn.to_node_id - 1}`
    }));

    return {
        nodes: reactFlowNodes,
        edges: reactFlowEdges
    };
};
