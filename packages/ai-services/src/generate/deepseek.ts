import { Feature, Subfeature, FeatureOptions } from '../modelRegistry'
import { generateText, streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekAI = createDeepSeek({
  apiKey:
    typeof process !== 'undefined' ? process.env.DEEPSEEK_API_KEY ?? '' : '',
})

type GenerateInput = {
  model: string
  feature: Feature
  subfeature: Subfeature
  featureOptions: FeatureOptions
  input: any
}

export async function generate({
  model,
  feature,
  subfeature,
  featureOptions,
  input,
}: GenerateInput): Promise<any> {
  if (feature === Feature.Llm && subfeature === Subfeature.Chat) {
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
  throw new Error(
    `Feature '${feature}/${subfeature}' not implemented yet for DeepSeek`
  )
}
