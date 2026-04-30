export const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  return (
    <div
      className={`absolute top-20 right-6 px-4 py-2 rounded shadow-xl z-50 text-sm font-medium border ${
        type === "error"
          ? "bg-red-900/90 border-red-500 text-red-100"
          : type === "info"
            ? "bg-blue-900/90 border-blue-500 text-blue-100"
            : "bg-green-900/90 border-green-500 text-green-100"
      } backdrop-blur-md transition-all`}
    >
      {message}
    </div>
  );
};
