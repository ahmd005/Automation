import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';
import aiReducer from './aiSlice';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    ai: aiReducer,
  },
});
