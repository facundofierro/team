import { Feature, FeatureOptions } from '../modelRegistry'
import { fal } from '@fal-ai/client'

// Optionally configure API key from env
if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY })
}

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
  if (feature === Feature.TextToImage) {
    const result = await fal.subscribe(model, {
      input,
    })
    // Return the first image URL
    return result.data.images?.[0]?.url
  }
  if (feature === Feature.TextToSpeech) {
    const result = await fal.subscribe(model, {
      input,
    })
    return result.data.audio?.url
  }
  if (feature === Feature.VideoGeneration) {
    const result = await fal.subscribe(model, {
      input,
    })
    return result.data.video?.url
  }
  throw new Error(`Feature '${feature}' not implemented yet for FAL`)
}
