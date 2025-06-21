import { Feature, Subfeature, FeatureOptions } from '../modelRegistry'
import { generateText, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey:
    typeof process !== 'undefined' ? process.env.OPENAI_API_KEY ?? '' : '',
})

function getApiKey(): string {
  const apiKey =
    typeof process !== 'undefined' ? process.env.OPENAI_API_KEY ?? '' : ''
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY')
  }
  return apiKey
}

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

  const apiKey = getApiKey()

  if (feature === Feature.Text && subfeature === Subfeature.Embeddings) {
    const { text } = input
    const data = await openaiRequest('/embeddings', apiKey, {
      model,
      input: text,
    })
    return data.data
  }

  if (feature === Feature.Image && subfeature === Subfeature.Generation) {
    const { prompt, ...rest } = input
    const data = await openaiRequest('/images/generations', apiKey, {
      model,
      prompt,
      ...rest,
    })
    return data.data[0]
  }

  if (
    feature === Feature.Audio &&
    subfeature === Subfeature.SpeechToTextAsync
  ) {
    const { audio, ...rest } = input
    const formData = new FormData()
    formData.append('file', new Blob([audio]), 'audio.wav')
    formData.append('model', model)
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const data = await openaiRequest(
      '/audio/transcriptions',
      apiKey,
      formData,
      {
        isFormData: true,
      }
    )
    return data.text
  }

  if (feature === Feature.Audio && subfeature === Subfeature.TextToSpeech) {
    const { text, voice, ...rest } = input
    const audioBuffer = await openaiRequest('/audio/speech', apiKey, {
      model,
      input: text,
      voice,
      ...rest,
    })
    return audioBuffer
  }

  throw new Error(
    `Feature '${feature}/${subfeature}' not implemented yet for OpenAI`
  )
}

async function openaiRequest(
  endpoint: string,
  apiKey: string,
  body: any,
  options: {
    isFormData?: boolean
  } = {}
) {
  const { isFormData = false } = options

  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
  }
  let requestBody: BodyInit

  if (isFormData) {
    requestBody = body as FormData
  } else {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`https://api.openai.com/v1${endpoint}`, {
    method: 'POST',
    headers,
    body: requestBody,
  })

  if (!response.ok) {
    const err = await response.text()
    const apiName = endpoint.split('/').pop() || 'API'
    throw new Error(`OpenAI ${apiName} error: ${err}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  if (contentType?.startsWith('audio/')) {
    return Buffer.from(await response.arrayBuffer())
  }
  return response.text()
}
