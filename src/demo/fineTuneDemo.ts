import { FineTuneModelConfig } from '../types';

export const FINETUNE_MODELS: FineTuneModelConfig[] = [
  {
    id: 'm1',
    name: 'ParsBERT Base (طبقه‌بند متنی)',
    baseArchitecture: 'parsbert-base-uncased',
    datasetVariant: 'gold_full',
    status: 'completed',
    f1Score: 0.76,
    loss: 0.22,
  },
  {
    id: 'm2',
    name: 'FaBERT Architecture (بهترین دقت)',
    baseArchitecture: 'fabert-base',
    datasetVariant: 'gold_full',
    status: 'completed',
    f1Score: 0.78,
    loss: 0.19,
  },
  {
    id: 'm3',
    name: 'TF-IDF + Logistic Regression (خط پایه)',
    baseArchitecture: 'classical-ml',
    datasetVariant: 'silver',
    status: 'completed',
    f1Score: 0.64,
    loss: 0.45,
  },
];

export const FINETUNE_EVAL_ROWS = [
  {
    model: 'TF-IDF + LogReg (خط پایه)',
    silverF1: 0.61,
    goldenF1: 0.64,
    improvementPts: 3,
  },
  {
    model: 'ParsBERT Base (ترنسفورمر فارسی)',
    silverF1: 0.72,
    goldenF1: 0.76,
    improvementPts: 4,
  },
  {
    model: 'FaBERT (بهترین دقت طبقه‌بندی)',
    silverF1: 0.74,
    goldenF1: 0.78,
    improvementPts: 4,
  },
];
