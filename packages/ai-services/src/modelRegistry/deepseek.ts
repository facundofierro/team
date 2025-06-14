import { Feature, ModelInfo } from '../modelRegistry'

export const deepseekModels: ModelInfo[] = [
  {
    id: 'deepseek:deepseek-v3-0324',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek V3 0324',
    provider: 'deepseek',
    model: 'deepseek-v3-0324',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
  {
    id: 'deepseek:deepseek-v3-base',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek V3 Base',
    provider: 'deepseek',
    model: 'deepseek-v3-base',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
  {
    id: 'deepseek:deepseek-r1',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek R1',
    provider: 'deepseek',
    model: 'deepseek-r1',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
  {
    id: 'deepseek:deepseek-r1-zero',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek R1 Zero',
    provider: 'deepseek',
    model: 'deepseek-r1-zero',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
  {
    id: 'deepseek:deepseek-r1-distill-llama-70b',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek R1 Distill Llama 70B',
    provider: 'deepseek',
    model: 'deepseek-r1-distill-llama-70b',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
  {
    id: 'deepseek:deepseek-r1-distill-qwen-32b',
    features: [Feature.ChatAPI],
    displayName: 'DeepSeek R1 Distill Qwen 32B',
    provider: 'deepseek',
    model: 'deepseek-r1-distill-qwen-32b',
    featureOptions: {
      [Feature.ChatAPI]: { json: false },
    },
  },
]
