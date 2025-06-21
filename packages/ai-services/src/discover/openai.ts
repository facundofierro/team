import OpenAI from 'openai'
import { db } from '../db'
import * as schema from '../db/schema'
import { Feature, Subfeature } from '../modelRegistry'
import { sql, eq, and, inArray } from 'drizzle-orm'

// Helper function to generate display names based on the user's example
const getDisplayName = (modelId: string): string => {
  const names: Record<string, string> = {
    'gpt-4.1-nano': 'GPT-4.1 Nano',
    'gpt-4o': 'GPT-4o',
    'gpt-image-1': 'GPT Image 1',
    o3: 'o3',
    'o3-pro': 'o3 Pro',
    'o4-mini': 'o4 Mini',
    'text-embedding-3-large': 'Embedding 3 Large',
    'text-embedding-3-small': 'Embedding 3 Small',
    'text-embedding-ada-002': 'Ada Embedding',
    'tts-1': 'TTS-1',
    'tts-1-hd': 'TTS-1 HD',
    'whisper-1': 'Whisper',
    'dall-e-2': 'DALL·E 2',
    'dall-e-3': 'DALL·E 3',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'gpt-4': 'GPT-4',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-4-vision-preview': 'GPT-4 Vision',
  }
  return (
    names[modelId] ||
    modelId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )
}

const getGroupDisplayName = (
  feature: Feature,
  subfeature: Subfeature
): string => {
  switch (feature) {
    case Feature.Llm:
      return 'OpenAI Chat'
    case Feature.Text:
      if (subfeature === Subfeature.Embeddings) return 'OpenAI Embeddings'
      return 'OpenAI Text'
    case Feature.Audio:
      if (subfeature === Subfeature.TextToSpeech) return 'OpenAI Text-to-Speech'
      if (subfeature === Subfeature.SpeechToTextAsync)
        return 'OpenAI Speech-to-Text'
      return 'OpenAI Audio'
    case Feature.Image:
      return 'OpenAI Image Generation'
    default:
      // Fallback for any new/unhandled feature
      const featureName = feature.charAt(0).toUpperCase() + feature.slice(1)
      const subfeatureName = subfeature
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return `OpenAI ${featureName} ${subfeatureName}`
  }
}

// Helper function to determine the feature of a model
const getFeature = (
  modelId: string
): { feature: Feature; subfeature: Subfeature } => {
  if (modelId.startsWith('gpt-') || /^o\\d/.test(modelId)) {
    return { feature: Feature.Llm, subfeature: Subfeature.Chat }
  }
  if (modelId.startsWith('text-embedding')) {
    return { feature: Feature.Text, subfeature: Subfeature.Embeddings }
  }
  if (modelId.startsWith('tts')) {
    return { feature: Feature.Audio, subfeature: Subfeature.TextToSpeech }
  }
  if (modelId.startsWith('whisper')) {
    return { feature: Feature.Audio, subfeature: Subfeature.SpeechToTextAsync }
  }
  if (modelId.startsWith('dall-e') || modelId.includes('image')) {
    return { feature: Feature.Image, subfeature: Subfeature.Generation }
  }
  // This is a placeholder, we might need a more specific subfeature for unknown
  return { feature: Feature.Text, subfeature: Subfeature.Chat }
}

// Helper function to determine feature options based on our knowledge
const getFeatureOptions = (feature: Feature) => {
  switch (feature) {
    case Feature.Llm:
      return { streaming: true, json: true }
    case Feature.Audio:
      return { streaming: true }
    default:
      return {}
  }
}

export const discover = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const modelsList = await openai.models.list()
  const providerId = 'openai'

  // Group models by feature and subfeature
  const groupedModels = new Map<string, OpenAI.Model[]>()
  for (const model of modelsList.data) {
    const { feature, subfeature } = getFeature(model.id)
    const key = `${feature}:${subfeature}`
    if (!groupedModels.has(key)) {
      groupedModels.set(key, [])
    }
    groupedModels.get(key)!.push(model)
  }

  // Create a single model entry for each group
  const modelsToUpsert = Array.from(groupedModels.values()).map((models) => {
    // Sort by creation time to get the latest model, which will be the default
    const sortedModels = models.sort((a, b) => b.created - a.created)
    const latestModel = sortedModels[0]
    const { feature, subfeature } = getFeature(latestModel.id)

    return {
      id: `${providerId}:${feature}:${subfeature}`,
      displayName: getGroupDisplayName(feature, subfeature),
      provider: providerId,
      model: latestModel.id,
      feature: feature,
      subfeature: subfeature,
      gateway: providerId,
      priority: latestModel.created,
      featureOptions: getFeatureOptions(feature),
      availableModels: sortedModels.map((m) => m.id),
    }
  })

  console.log('--- Discovered OpenAI Models to be upserted ---')
  console.log(JSON.stringify(modelsToUpsert, null, 2))
  console.log('-------------------------------------------')

  // Step 1: Get all model IDs from the provider
  const providerModelIds = modelsToUpsert.map((model) => model.id)

  // Step 2: Get all model IDs from the database for this provider
  const dbModels = await db
    .select({ id: schema.models.id })
    .from(schema.models)
    .where(eq(schema.models.provider, providerId))
  const dbModelIds = dbModels.map((model) => model.id)

  // Step 3: Determine which models to delete
  const modelsToDelete = dbModelIds.filter(
    (id) => !providerModelIds.includes(id)
  )

  // Step 4: Delete obsolete models
  if (modelsToDelete.length > 0) {
    console.log('--- Deleting obsolete OpenAI Models ---')
    console.log(JSON.stringify(modelsToDelete, null, 2))
    console.log('------------------------------------')
    await db
      .delete(schema.models)
      .where(inArray(schema.models.id, modelsToDelete))
  }

  if (modelsToUpsert.length > 0) {
    await db
      .insert(schema.models)
      .values(modelsToUpsert)
      .onConflictDoUpdate({
        target: schema.models.id,
        set: {
          displayName: sql`excluded.display_name`,
          provider: sql`excluded.provider`,
          model: sql`excluded.model`,
          feature: sql`excluded.feature`,
          subfeature: sql`excluded.subfeature`,
          gateway: sql`excluded.gateway`,
          priority: sql`excluded.priority`,
          featureOptions: sql`excluded.feature_options`,
          availableModels: sql`excluded.available_models`,
        },
      })
    console.log(`Upserted ${modelsToUpsert.length} models into the database.`)
  } else {
    console.log('No models found to upsert.')
  }

  return modelsToUpsert
}
