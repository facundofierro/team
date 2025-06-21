import { Feature, Subfeature, FeatureOptions } from '../modelRegistry'
import axios from 'axios'

type GenerateInput = {
  feature: Feature
  subfeature: Subfeature
  featureOptions: FeatureOptions
  model: string
  input: any
}

const getEdenAIFeature = (feature: Feature, subfeature: Subfeature): string => {
  return `${feature.toString()}/${subfeature.toString()}`
}

export async function generate({
  model,
  feature,
  subfeature,
  featureOptions,
  input,
}: GenerateInput): Promise<any> {
  const [provider, modelName] = model.split('/')

  const url = `https://api.edenai.run/v2/${getEdenAIFeature(
    feature,
    subfeature
  )}`

  const payload: any = {
    response_as_dict: true,
    attributes_as_list: false,
    show_original_response: false,
    providers: provider,
    ...input,
  }

  // If a specific model is selected in featureOptions, use it
  const selectedModel = featureOptions?.llm_details?.[provider]
  if (selectedModel) {
    payload.settings = { [provider]: selectedModel }
  }

  const headers = {
    Authorization: `Bearer ${process.env.EDEN_API_KEY}`,
  }

  try {
    const response = await axios.post(url, payload, { headers })
    return response.data
  } catch (error) {
    console.error('Error calling Eden AI API:', error)
    throw error
  }
}
