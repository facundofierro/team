import { ModelInfo, Feature, FeatureOptions } from './modelRegistry'
import * as openaiProvider from './generate/openai'
import * as deepseekProvider from './generate/deepseek'
import * as falProvider from './generate/fal'

export async function generate({
  provider,
  model,
  feature,
  featureOptions,
  input,
}: {
  provider: string
  model: string
  feature: Feature
  featureOptions: FeatureOptions
  input: any
}): Promise<any> {
  switch (provider) {
    case 'openai':
      return openaiProvider.generate({ model, feature, featureOptions, input })
    case 'deepseek':
      return deepseekProvider.generate({
        model,
        feature,
        featureOptions,
        input,
      })
    default:
      throw new Error(`Provider '${provider}' not implemented yet`)
  }
}
