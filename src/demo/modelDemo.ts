import { ModelProvider } from '../types';

export const INITIAL_PROVIDERS: ModelProvider[] = [
  {
    id: 'lm',
    name: 'LM Studio Local Server',
    type: 'local',
    url: 'http://127.0.0.1:1234/v1',
    status: 'connected',
    models: ['qwen2.5-14b-instruct', 'llama-3.1-8b-instruct'],
    active: true,
    isExternal: false,
  },
  {
    id: 'ol',
    name: 'Ollama Internal Gateway',
    type: 'lan',
    url: 'http://192.168.1.45:11434',
    status: 'connected',
    models: ['gemma2:9b-persian', 'mistral-nemo:12b'],
    active: true,
    isExternal: false,
  },
  {
    id: 'or',
    name: 'OpenRouter Cloud Gateway',
    type: 'cloud',
    url: 'https://openrouter.ai/api/v1',
    status: 'connected',
    models: ['gpt-4o-mini', 'claude-3-5-haiku'],
    active: false,
    isExternal: true,
  },
];
