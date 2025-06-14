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
    const { prompt, ...rest } = input
    const result = await fal.subscribe(model, {
      input: {
        prompt,
        ...rest,
      },
    })
    // Return the first image URL
    return result.data.images?.[0]?.url
  }
  throw new Error(`Feature '${feature}' not implemented yet for FAL`)
}
