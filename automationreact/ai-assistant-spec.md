🤖 Ultra-Detailed Specification: AI Assistant Sidebar (Copilot-Style)
1. Executive Summary
The objective is to implement an integrated AI Chatbot sidebar, positioned on the left side of the screen (mirroring the VS Code Copilot experience). This assistant acts as a "Natural Language Controller" for the automation graph. It can either chat normally or execute backend commands to modify nodes (Color, Log, Size) and trigger logic.

2. UI/UX Design (Copilot Layout)
Position: Fixed Sidebar on the Left Side (Width: 350px - 400px).

Behavior: Slide-in/out animation using Framer Motion.

Layout Structure:

Header: Title "AI Assistant", Status indicator (Online/Typing), and a Close button.

Message Area: Scrollable list with auto-scroll to bottom.

Input Area: Fixed at the bottom with a multiline textarea that expands, a "Send" button, and a "Clear Chat" option.

Styling: Glassmorphism (backdrop-blur), borders matching the system's Slate-theme, and professional message bubbles.

3. Technical Stack & Dependencies
Markdown Rendering: react-markdown (To render AI responses correctly).

Icons: lucide-react (Sparkles, Send, Trash, User, Bot).

Animations: framer-motion.

State Management: Redux Toolkit (To manage chat visibility and history).

Data Fetching: Axios + TanStack Query (For API interaction).

4. API Communication Contract
4.1 Chat Request
Endpoint: POST http://127.0.0.1:8000/api/ai/chat

Payload: { "prompt": "string" }

4.2 Intelligence Response Handling
The frontend must switch logic based on the type field in the response:

Case A: type: "command" (Action Trigger)
Effect: The AI has modified the database directly (e.g., changed a node color).

Required Action: 1.  Immediately trigger a Refetch of the Graph Data (GET /api/load-graph).
2.  Show a Success Toast with the message.
3.  Display the execution_log in a specialized "System Message" bubble.

Case B: type: "chat" (Standard Response)
Effect: Standard conversation or explanation.

Required Action:

Append the message to the chat history.

Render using react-markdown.

5. System Architecture (Folders & Files)
Plaintext
src/
├── components/
│   └── AI/
│       ├── ChatSidebar.jsx     # Main Container (Framer Motion)
│       ├── MessageList.jsx     # Scrollable Area
│       ├── MessageBubble.jsx   # Individual Message (AI vs User)
│       └── ChatInput.jsx       # Textarea & Send Logic
├── hooks/
│   └── useAIChat.js            # Mutation hook using TanStack Query
├── store/
│   └── aiSlice.js              # Redux: isOpen, messages[], isTyping
└── services/
    └── aiService.js            # Axios POST call to /api/ai/chat
6. Implementation Logic (Detailed Steps)
Step 1: Redux State Setup
Initialize aiSlice to store the conversation history. This ensures that even if the sidebar is closed and reopened, the chat history persists.

Step 2: The useAIChat Hook
Create a custom hook using useMutation:

onMutate: Add the User's message to Redux and set isTyping: true.

onSuccess: * If data.type === 'command':
* Call queryClient.invalidateQueries(['graph']) to refresh the canvas.
* Add AI's success message to chat.

If data.type === 'chat':

Add AI's response to chat.

onError: Display a professional error message in the chat bubble.

Step 3: Interactive UI (Framer Motion)
The sidebar should use initial={{ x: '-100%' }} and animate={{ x: 0 }}.

Messages should fade in one by one.

The "Typing..." indicator should be a subtle animated 3-dot pulse.

7. Development Checklist for Copilot
Dependency Install: npm install react-markdown lucide-react framer-motion.

API Service: Implement aiService.js to point to the Laravel endpoint.

Redux Slice: Create aiSlice.js to manage the sidebar's visibility and message history.

UI Construction: Build the ChatSidebar.jsx with a "Copilot" look (narrow, tall, fixed left).

Logic Wiring: Connect the ChatInput to the useAIChat hook.

Refresh Logic: Ensure that when a command is received, the React Flow canvas updates immediately without a full page reload.

8. Constraints & Edge Cases
Empty Prompt: Disable the send button if the input is empty.

Long Responses: Ensure the message area handles long AI explanations with a clean scrollbar.

Auto-Scroll: Every time a new message (User or AI) is added, the window must scroll to the bottom smoothly.

Loading State: While waiting for the AI, the input should be disabled and a "Thinking..." indicator must be visible.

Instructions for Implementation:
Read context: Always refer to the main automation-spec.md for graph-refreshing logic.

Refactor: Keep the AI logic in its own services and hooks as per the Clean Architecture guidelines.

Style: Use Tailwind CSS for all components, focusing on a dark, professional "Developer Tool" aesthetic.