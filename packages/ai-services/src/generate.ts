import { ModelInfo, Feature, FeatureOptions, Subfeature } from './modelRegistry'
import * as openaiProvider from './generate/openai'
import * as deepseekProvider from './generate/deepseek'
import * as falProvider from './generate/fal'
import * as edenProvider from './generate/eden'
import { log } from '@repo/logger'

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
  log.aiServices.generation.info('AI generation request started', undefined, {
    provider,
    gateway,
    model,
    feature,
    subfeature,
    hasFeatureOptions: !!featureOptions,
    inputType: typeof input,
    inputSize: input
      ? typeof input === 'string'
        ? input.length
        : 'object'
      : 'none',
  })

  try {
    let result: any

    switch (gateway) {
      case 'openai':
        log.aiServices.provider.debug('Using OpenAI provider', undefined, {
          model,
          feature,
          subfeature,
        })
        result = await openaiProvider.generate({
          model,
          feature,
          subfeature,
          featureOptions,
          input,
        })
        break
      case 'deepseek':
        log.aiServices.provider.debug('Using DeepSeek provider', undefined, {
          model,
          feature,
          subfeature,
        })
        result = await deepseekProvider.generate({
          model,
          feature,
          subfeature,
          featureOptions,
          input,
        })
        break
      case 'fal':
        log.aiServices.provider.debug('Using Fal provider', undefined, {
          model,
          feature,
          subfeature,
        })
        result = await falProvider.generate({
          model,
          feature,
          subfeature,
          featureOptions,
          input,
        })
        break
      case 'eden':
        log.aiServices.provider.debug('Using Eden AI provider', undefined, {
          model,
          feature,
          subfeature,
        })
        result = await edenProvider.generate({
          model,
          feature,
          subfeature,
          featureOptions,
          input,
        })
        break
      default:
        log.aiServices.provider.error(
          'Unsupported provider requested',
          undefined,
          {
            provider,
            gateway,
            supportedProviders: ['openai', 'deepseek', 'fal', 'eden'],
          }
        )
        throw new Error(`Provider '${provider}' not implemented yet`)
    }

    log.aiServices.generation.info(
      'AI generation completed successfully',
      undefined,
      {
        provider,
        gateway,
        model,
        feature,
        subfeature,
        resultType: typeof result,
        isStream: result instanceof ReadableStream,
      }
    )

    return result
  } catch (error: any) {
    log.aiServices.generation.error('AI generation failed', undefined, {
      provider,
      gateway,
      model,
      feature,
      subfeature,
      error: error.message || 'Unknown error',
      stack: error.stack,
    })
    throw error
  }
}
