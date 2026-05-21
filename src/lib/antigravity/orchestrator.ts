import { discoverProviders } from './agents/discoveryAgent';
import { extractIntentAndSlots } from './agents/intentAgent';
import { languageNormalize } from './agents/languageAgent';
import { addTrace, TraceEntry } from './traceService';

export type ServiceOrchestratorInput = {
  userMessage: string;
  customerProfile?: any;
  context?: any;
};

export async function runServiceOrchestrator(input: ServiceOrchestratorInput) {
  const traceId = `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const now = new Date().toISOString();

  // 1) LanguageNormalizationAgent
  const lang = await languageNormalize(input.userMessage);
  await addTrace({
    traceId,
    timestamp: now,
    workflowName: 'service_orchestrator',
    stepName: 'LanguageNormalizationAgent',
    inputs: { userMessage: input.userMessage },
    outputs: lang,
  } as TraceEntry);

  // 2) IntentAndSlotExtractionAgent
  const extraction = await extractIntentAndSlots(input.userMessage, lang);
  await addTrace({
    traceId,
    timestamp: new Date().toISOString(),
    workflowName: 'service_orchestrator',
    stepName: 'IntentAndSlotExtractionAgent',
    inputs: { normalized: lang },
    outputs: extraction,
  } as TraceEntry);

  if (extraction.clarifyingQuestion) {
    return { assistantMessage: extraction.clarifyingQuestion, traceId };
  }

  // 3) ProviderDiscoveryAgent
  const providers = await discoverProviders(extraction.slots || {});
  await addTrace({
    traceId,
    timestamp: new Date().toISOString(),
    workflowName: 'service_orchestrator',
    stepName: 'ProviderDiscoveryAgent',
    inputs: { slots: extraction.slots },
    outputs: { count: providers.length, sample: providers.slice(0,3) },
  } as TraceEntry);

  // Simplified recommendation: pick top 3
  const recommendations = providers.slice(0, 3).map((p:any)=>({ provider: p, reason: 'mocked' }));

  const assistantMessage = `Found ${providers.length} providers. Top recommendations ready.`;

  const result = {
    assistantMessage,
    understanding: extraction,
    recommendations,
    bookingDraftPreview: null,
    traceId,
  };

  await addTrace({
    traceId,
    timestamp: new Date().toISOString(),
    workflowName: 'service_orchestrator',
    stepName: 'Result',
    inputs: input,
    outputs: result,
  } as TraceEntry);

  return result;
}
