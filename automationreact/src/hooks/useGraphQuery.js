import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { formatGraphFromBackend } from "../utils/pathfinder";

export const useGraphQuery = ({ nodeTypes, syncGraph, enabled = true } = {}) => {
  const query = useQuery({
    queryKey: ["graph"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get("/api/load-graph");
      return data;
    },
  });

  useEffect(() => {
    if (!query.data || !syncGraph) return;
    const { nodes, edges } = formatGraphFromBackend(
      query.data,
      nodeTypes || [],
    );
    syncGraph(nodes, edges);
  }, [query.dataUpdatedAt, query.data, nodeTypes, syncGraph]);

  useEffect(() => {
    if (query.isError) {
      console.warn("Graph query failed:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
