import { ModelInfo, Feature, FeatureOptions, Subfeature } from './modelRegistry'
import * as openaiProvider from './generate/openai'
import * as deepseekProvider from './generate/deepseek'
import * as falProvider from './generate/fal'
import * as edenProvider from './generate/eden'

type GenerateInput = {
  feature: Feature
  subfeature: Subfeature
  provider: string
  gateway: string
  featureOptions: FeatureOptions
  model: string
  input: any
}

export async function generate({
  feature,
  subfeature,
  provider,
  gateway,
  featureOptions,
  model,
  input,
}: GenerateInput): Promise<any> {
  switch (gateway) {
    case 'openai':
      return openaiProvider.generate({
        model,
        feature,
        subfeature,
        featureOptions,
        input,
      })
    case 'deepseek':
      return deepseekProvider.generate({
        model,
        feature,
        subfeature,
        featureOptions,
        input,
      })
    case 'fal':
      return falProvider.generate({
        model,
        feature,
        subfeature,
        featureOptions,
        input,
      })
    case 'eden':
      return edenProvider.generate({
        model,
        feature,
        subfeature,
        featureOptions,
        input,
      })
    default:
      throw new Error(`Provider '${provider}' not implemented yet`)
  }
}
