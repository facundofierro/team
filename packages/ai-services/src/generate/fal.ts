import { Feature, Subfeature, FeatureOptions } from '../modelRegistry'
import { fal } from '@fal-ai/client'

// Optionally configure API key from env
if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY })
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
  if (feature === Feature.Image && subfeature === Subfeature.Generation) {
    const result: any = await fal.subscribe(model, {
      input,
    })
    // Return the first image URL
    return result.images?.[0]?.url
  }
  if (feature === Feature.Audio && subfeature === Subfeature.TextToSpeech) {
    const result: any = await fal.subscribe(model, {
      input,
    })
    return result.audio?.url
  }
  if (
    feature === Feature.Video &&
    (subfeature === Subfeature.GenerationAsync ||
      subfeature === Subfeature.QuestionAnswer)
  ) {
    const result: any = await fal.subscribe(model, {
      input,
    })
    return result.video?.url
  }
  throw new Error(
    `Feature '${feature}/${subfeature}' not implemented yet for FAL`
  )
}
