import { Feature, FeatureOptions } from '../modelRegistry'
import { generateText, streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekAI = createDeepSeek({
  apiKey:
    typeof process !== 'undefined' ? process.env.DEEPSEEK_API_KEY ?? '' : '',
})

export async function generate({
  model,
  feature,
  featureOptions,
  input,
}: {
  model: string
  feature: Feature
  featureOptions: FeatureOptions
  input: any
}): Promise<any> {
  if (feature === Feature.ChatAPI) {
    const {
      messages,
      systemPrompt = '',
      temperature = 0.7,
      maxTokens = 1000,
    } = input
    const modelInstance = deepseekAI(model)
    if (featureOptions?.streaming) {
      return streamText({
        model: modelInstance,
        system: systemPrompt,
        messages,
        temperature,
        maxTokens,
        ...(featureOptions?.json ? { responseFormat: 'json_object' } : {}),
      })
    } else {
      const result = await generateText({
        model: modelInstance,
        system: systemPrompt,
        messages,
        temperature,
        maxTokens,
        ...(featureOptions?.json ? { responseFormat: 'json_object' } : {}),
      })
      return result.text
    }
  }
  throw new Error(`Feature '${feature}' not implemented yet for DeepSeek`)
}
