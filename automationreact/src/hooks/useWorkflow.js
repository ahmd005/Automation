import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateNodeData, setNodes, setEdges, setIsRunning, setGraph } from '../store/workflowSlice';

export const useWorkflow = () => {
  const dispatch = useDispatch();
  const { nodes, edges, nodeTypes, isRunning, lastLoaded } = useSelector((state) => state.workflow);

  const updateData = useCallback((id, key, value) => {
    dispatch(updateNodeData({ id, key, value }));
  }, [dispatch]);

  const syncGraph = useCallback((newNodes, newEdges) => {
    dispatch(setGraph({ nodes: newNodes, edges: newEdges }));
  }, [dispatch]);
  
  const setRunningState = useCallback((status) => {
    dispatch(setIsRunning(status));
  }, [dispatch]);

  return { nodes, edges, nodeTypes, isRunning, updateData, syncGraph, setRunningState };
};
