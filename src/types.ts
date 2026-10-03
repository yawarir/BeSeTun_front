export type UserRole = 'admin' | 'operator';

export type AppTheme = 'light' | 'dark';

export type MainStepKey =
  | 'dash'
  | 'data'
  | 'labels'
  | 'model'
  | 'expert'
  | 'keyword'
  | 'results'
  | 'tune'
  | 'settings';

export type StepStatus = 'done' | 'active' | 'ready' | 'locked';

export interface StepDefinition {
  key: MainStepKey;
  stepNumber: number;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  defaultTab: string;
}

export interface FunnelStep {
  id: string;
  label: string;
  count: number;
  dropCount: number;
  dropReason: string;
}

export interface CleaningRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  dropEstimate: number;
}

export interface RawTextRecord {
  id: number;
  text: string;
  sourceFile: string;
  status: 'raw' | 'cleaned' | 'sampled_ref' | 'sampled_rev' | 'dropped';
  dropReason?: string;
  modelSuggestions: number[];
  modelRunB: number[];
  isSuspicious?: boolean;
}

export interface LabelItem {
  id: number;
  name: string;
  definition: string;
  example: string;
  keyShortcut: string; // '1' through '8'
  color: string;
}

export interface CandidateLabel {
  id: number;
  name: string;
  frequency: number;
  selected: boolean;
}

export interface ModelProvider {
  id: string;
  name: string;
  type: 'local' | 'lan' | 'cloud';
  url: string;
  status: 'connected' | 'disconnected';
  models: string[];
  active: boolean;
  isExternal: boolean;
}

export interface AnnotatorProgress {
  id: string;
  name: string;
  username: string;
  initial: string;
  refCompleted: number;
  refTotal: number;
  revCompleted: number;
  revTotal: number;
  lastActive: string;
}

export interface AdjudicationItem {
  id: number;
  textId: number;
  text: string;
  expert1Labels: number[];
  expert2Labels: number[];
  finalLabels: number[];
  resolved: boolean;
  note: string;
}

export interface OperatorAnswer {
  labels: number[];
  noReason: boolean;
  piiFlag: boolean;
  badAnonFlag: boolean;
  notes?: string;
  touched: boolean;
  savedAt?: string;
}

export interface FineTuneModelConfig {
  id: string;
  name: string;
  baseArchitecture: string;
  datasetVariant: 'silver' | 'gold_half' | 'gold_full';
  status: 'ready' | 'training' | 'completed';
  f1Score?: number;
  loss?: number;
}
