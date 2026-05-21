import { useAntiGravityStore } from '../store/useAntiGravityStore';
import type { ServiceCategoryFilter } from '../types';

export type ServiceOrchestratorContext = {
  preferredCategory: ServiceCategoryFilter | null;
  uiFilters: {
    category: ServiceCategoryFilter;
  };
};

export async function runWorkflow(workflowName: 'service_orchestrator', input: { userMessage: string; customerProfile?: any; context?: ServiceOrchestratorContext }) {
  if (workflowName !== 'service_orchestrator') {
    throw new Error(`Unsupported workflow: ${workflowName}`);
  }

  const { processUserRequest } = useAntiGravityStore.getState();
  return processUserRequest(input.userMessage, input.context);
}
