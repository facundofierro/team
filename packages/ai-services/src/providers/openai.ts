import { Feature, FeatureOptions } from '../modelRegistry'
import { generateText, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey:
    typeof process !== 'undefined' ? process.env.OPENAI_API_KEY ?? '' : '',
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
    const modelInstance = openaiAI(model)
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
  if (feature === Feature.Embeddings) {
    // input: { text: string }
    const { text } = input
    const apiKey =
      typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : ''
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY')
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenAI Embeddings API error: ${err}`)
    }
    const data = await response.json()
    // Return the embeddings array (or first embedding if only one input)
    return data.data
  }
  throw new Error(`Feature '${feature}' not implemented yet for OpenAI`)
}
