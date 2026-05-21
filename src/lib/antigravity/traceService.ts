import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const TRACE_KEY = 'agent_traces_v1';
const APP_MODE = process.env.EXPO_PUBLIC_APP_MODE || 'mock';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Safe lazy initialization of Supabase client to avoid breaking when keys are missing/swapped
let supabase: any = null;
if (APP_MODE === 'real' && SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('[TraceService] Supabase initialization failed:', e);
  }
}

export type TraceEntry = {
  traceId: string;
  timestamp: string;
  workflowName: string;
  stepName: string;
  inputs: any;
  outputs: any;
  confidence?: any;
  toolCalls?: any;
  latencyMs?: number;
  meta?: any;
};

export async function addTrace(entry: TraceEntry) {
  // Always write to local storage as an immutable local ledger
  try {
    const raw = await AsyncStorage.getItem(TRACE_KEY);
    const list: TraceEntry[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    await AsyncStorage.setItem(TRACE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[TraceService] AsyncStorage write failed:', e);
  }

  // If in real mode and Supabase client is initialized, attempt write to Supabase
  if (APP_MODE === 'real' && supabase) {
    try {
      const { error } = await supabase
        .from('agent_traces')
        .insert([
          {
            trace_id: entry.traceId,
            timestamp: entry.timestamp,
            workflow_name: entry.workflowName,
            step_name: entry.stepName,
            inputs: typeof entry.inputs === 'string' ? entry.inputs : JSON.stringify(entry.inputs),
            outputs: typeof entry.outputs === 'string' ? entry.outputs : JSON.stringify(entry.outputs),
            confidence: entry.confidence,
            latency_ms: entry.latencyMs,
            meta: typeof entry.meta === 'string' ? entry.meta : JSON.stringify(entry.meta)
          }
        ]);
      if (error) {
        console.warn('[TraceService] Supabase insert warning (falling back to local):', error.message);
      } else {
        console.log('[TraceService] Immutable trace successfully written to Supabase:', entry.traceId);
      }
    } catch (err: any) {
      console.warn('[TraceService] Supabase connection failed (using local fallback):', err.message || err);
    }
  }

  return entry;
}

export async function getTraces() {
  try {
    const raw = await AsyncStorage.getItem(TRACE_KEY);
    return raw ? (JSON.parse(raw) as TraceEntry[]) : [];
  } catch (e) {
    console.warn('[TraceService] AsyncStorage read failed:', e);
    return [];
  }
}

export async function exportTraces() {
  const traces = await getTraces();
  return JSON.stringify(traces, null, 2);
}

export async function clearTraces() {
  try {
    await AsyncStorage.removeItem(TRACE_KEY);
  } catch (e) {
    console.warn('[TraceService] AsyncStorage clear failed:', e);
  }
}
