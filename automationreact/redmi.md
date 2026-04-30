🚀 Ultra-Detailed Specification: Visual Logic Automation Builder (The Master Blueprint)
1. Executive Summary
Build a professional-grade, node-based visual automation platform (similar to n8n). The application enables users to create complex logic flows by dragging dynamic nodes onto a canvas, configuring their internal data via an automated form engine, and connecting them to establish an execution sequence. The project bridges visual design with backend logic via a seamless JSON-based state synchronization.

2. Comprehensive Technical Stack
Core: React 18+ (Vite) for high-performance rendering.

Canvas & Graph Engine: React Flow (Essential for node rendering, edge management, and zoom/pan functionality).

Global State: Redux Toolkit. Redux will act as the "Source of Truth," synchronizing with React Flow’s internal state to ensure data persistence and undo/redo capabilities.

Server Communication: Axios with Interceptors for centralized error handling.

Asynchronous State: TanStack Query (React Query) v5 for caching node types and managing loading/error states for API calls.

Styling: Tailwind CSS using a "Glassmorphism" design system (blur effects, semi-transparent borders).

Motion & UX: Framer Motion for sidebar transitions, node entrance animations, and interactive drag-and-drop feedback.

Icons: Lucide-React for a consistent, professional icon set.

3. Detailed API Architecture & Data Contracts
3.1 Dynamic Node Definition (Toolbox)
Endpoint: GET http://127.0.0.1:8000/api/node-types

Logic: The frontend must iterate over the returned fields array to render the correct input type:

string -> <input type="text" /> or <textarea />.

integer -> <input type="number" step="1" />.

color -> <input type="color" />.

3.2 Graph State Persistence (Save/Load)
Load Endpoint: GET http://192.168.213.230:8000/api/load-graph

Save Endpoint: POST http://192.168.213.230:8000/api/save-graph

JSON Schema Requirement:

JSON
{
  "nodes": [
    { 
      "id": "node_1", 
      "type": "Log", 
      "position": { "x": 150, "y": 200 }, 
      "data": { "text": "Starting Process..." } 
    }
  ],
  "connections": [
    { "from_node_id": "node_1", "to_node_id": "node_2" }
  ]
}
3.3 Execution Engine
Endpoint: POST http://192.168.213.230:8000/api/execute-logic

Frontend Logic: Traverse the graph. If Node A is connected to Node B, the path is [A, B]. Send this ordered array of IDs.

4. Advanced System Features & Logic
4.1 Redux Architecture (workflowSlice.js)
The state must manage:

nodes: Current nodes on canvas.

edges: Current connections.

nodeTypes: Cached definitions from API.

Critical Action - updateNodeData(id, key, value): This must update the data object of a specific node without re-rendering the entire canvas.

4.2 The "Brain": Pathfinding Algorithm
Implement a Depth-First Search (DFS) or Topological Sort.

Identify the "Start Node" (usually the leftmost or a node with no incoming connections).

Follow the target handles to generate a linear execution array for the backend.

4.3 UI/UX Design Tokens
Glassmorphism: Use bg-white/10 backdrop-blur-md border border-white/20 for nodes.

Node Interaction: Highlighting a node should change its border color to the color property defined in the node's API metadata.

Canvas Grid: Use React Flow's <Background variant="dots" gap={12} size={1} /> for a professional engineering look.

5. Project Folder Structure
Plaintext
src/
├── api/             # Axios instance & API calls
├── components/
│   ├── Canvas/      # React Flow implementation
│   ├── Sidebar/     # Draggable node list
│   ├── Nodes/       # Custom Node components (Log, Color, etc.)
│   └── Shared/      # Buttons, Inputs, Modals
├── store/           # Redux Toolkit (slices & hooks)
├── hooks/           # Custom hooks (useWorkflow, usePathfinder)
├── utils/           # Graph traversal logic & formatters
└── App.jsx          # Main layout (Sidebar + Canvas)
6. Autonomous Dependency Management
Permission Granted: You (Copilot/AI) are strictly authorized to install any necessary libraries or dev-tools required to fulfill this specification.

Silent Execution: Execute npm install for the following (and any others you see fit) immediately without asking:

reactflow, @reduxjs/toolkit, react-redux, axios, @tanstack/react-query, framer-motion, lucide-react, clsx, tailwind-merge.

Environment: Ensure all installations are compatible with the current Vite + React 18 environment.

7. Development Roadmap (Step-by-Step)
Phase 1: Infrastructure
Initialize Redux Store with a workflowSlice.

Configure Axios with a base URL http://192.168.213.230:8000.

Create TanStack Query provider to wrap the application.

Phase 2: Sidebar & Types
Fetch /api/node-types.

Render a list of draggable cards.

Implement onDragStart to pass the node type as metadata.

Phase 3: The Interactive Canvas
Setup React Flow with a custom node type AutomationNode.

Implement onDrop logic: Calculate coordinates, generate a unique ID, and dispatch addNode to Redux.

Map the Redux nodes and edges to the React Flow props.

Phase 4: Dynamic Forms
Inside AutomationNode, create a loop that renders inputs based on the node's fields.

Bind each input's onChange to Redux's updateNodeData.

Phase 5: Integration & Execution
Create a "Run Automation" button in the TopBar.

Implement the traversal utility to generate the path array.

Send the path to /api/execute-logic and display a success toast/notification.

8. Constraints & Edge Cases
Validation: A node cannot be connected to itself.

Persistence: Every time an edge is added or a node is moved, the state must sync with Redux.

Visual Feedback: Animated edges (running lights) should appear when a flow is "Active" or being executed.

Error Handling: If the API returns 500, show a sleek "Server Offline" badge on the sidebar.