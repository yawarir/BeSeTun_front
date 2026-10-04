/**
 * Re-exporting from src/demo to maintain backwards compatibility
 */
export * from './demo';

import { EXPERT_WALKTHROUGH_STEPS } from './demo/pipelineSteps';
export const OPERATOR_WALKTHROUGH_STEPS = EXPERT_WALKTHROUGH_STEPS;
export const SAMPLE_TEXTS: any[] = [];
export const SAMPLE_REF_TEXTS: any[] = [];
export const SAMPLE_REV_TEXTS: any[] = [];
