import { Handle, Position, useReactFlow } from "reactflow";
import { useDispatch } from "react-redux";
import { updateNodeData } from "../../store/workflowSlice";
import { X } from "lucide-react";

const parseColorToHex = (color) => {
  if (!color) return "#ffffff";

  const value = String(color).trim();

  if (value.startsWith("#")) return value.substring(0, 7);

  const match = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) {
    const r = parseInt(match[1], 10).toString(16).padStart(2, "0");
    const g = parseInt(match[2], 10).toString(16).padStart(2, "0");
    const b = parseInt(match[3], 10).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  if (typeof document !== "undefined") {
    const probe = document.createElement("span");
    probe.style.color = value;
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    probe.style.top = "-9999px";
    document.body.appendChild(probe);

    const computedColor = window.getComputedStyle(probe).color;
    document.body.removeChild(probe);

    const computedMatch = computedColor.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
    );

    if (computedMatch) {
      const r = parseInt(computedMatch[1], 10).toString(16).padStart(2, "0");
      const g = parseInt(computedMatch[2], 10).toString(16).padStart(2, "0");
      const b = parseInt(computedMatch[3], 10).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
  }

  return "#ffffff";
};

const hexToRgbStr = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : hex;
};

const resolveFieldValue = (data, fieldName) => {
  if (!data || !fieldName) return undefined;

  const matchedKey = Object.keys(data).find(
    (key) => key.toLowerCase() === fieldName.toLowerCase(),
  );

  return matchedKey ? data[matchedKey] : data[fieldName];
};

const resolveAccentColor = (data, nodeType) => {
  const colorField = nodeType?.fields?.find(
    (field) =>
      field.type === "color" || field.name.toLowerCase().includes("color"),
  );

  const fieldValue = colorField
    ? resolveFieldValue(data, colorField.name)
    : undefined;

  return (
    fieldValue ||
    data?.color ||
    data?.Color ||
    data?.textColor ||
    data?.hex ||
    nodeType?.color ||
    "#ffffff"
  );
};

export const AutomationNode = ({ id, data, selected }) => {
  const dispatch = useDispatch();
  const { setNodes } = useReactFlow();
  const { nodeType } = data; // the metadata passed from sidebar
  const accentColor = resolveAccentColor(data, nodeType);

  const handleChange = (e, fieldName) => {
    const value = e.target.value;

    // Update the Redux global state store
    dispatch(updateNodeData({ id, key: fieldName, value }));

    // Update the React Flow local UI state so you can see the typed text in real time
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, [fieldName]: value } };
        }
        return n;
      }),
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-md border rounded-lg p-4 min-w-50 shadow-xl text-white transition-all duration-200 group relative`}
      style={{
        borderColor: selected ? accentColor : "rgba(255, 255, 255, 0.2)",
        boxShadow: selected ? `0 0 15px ${accentColor}` : "none",
      }}
    >
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        title="Delete Node"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag on button
      >
        <X size={14} />
      </button>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-none"
      />

      <div
        className="font-bold text-sm mb-3 pb-2 border-b border-white/10"
        style={{
          color: accentColor,
          borderBottomColor: accentColor,
        }}
      >
        {nodeType?.label || "Unknown Node"}
      </div>

      <div className="flex flex-col gap-2">
        {nodeType?.fields?.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 capitalize">
              {field.label || field.name}
            </label>
            {field.type === "string" &&
              !field.name.toLowerCase().includes("color") && (
                <input
                  type="text"
                  placeholder="Type here..."
                  className="nodrag bg-gray-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                  value={data[field.name] || ""}
                  onChange={(e) => handleChange(e, field.name)}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              )}
            {field.type === "integer" && (
              <input
                type="number"
                step="1"
                placeholder="0"
                className="nodrag bg-gray-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                value={data[field.name] !== undefined ? data[field.name] : ""}
                onChange={(e) => handleChange(e, field.name)}
                onPointerDown={(e) => e.stopPropagation()}
              />
            )}
            {(field.type === "color" ||
              field.name.toLowerCase().includes("color")) && (
              <div className="flex w-full h-8">
                <input
                  type="color"
                  className="nodrag w-full h-full cursor-pointer focus:outline-none rounded border border-white/20 bg-gray-900"
                  value={parseColorToHex(
                    resolveFieldValue(data, field.name) || accentColor,
                  )}
                  onChange={(e) =>
                    handleChange(
                      { target: { value: hexToRgbStr(e.target.value) } },
                      field.name,
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400"
      />
    </div>
  );
};
