import OpenAI from 'openai'
import { db } from '../db'
import * as schema from '../db/schema'
import { Feature } from '../modelRegistry'
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

// Helper function to determine the feature of a model
const getFeature = (modelId: string): Feature => {
  if (modelId.startsWith('gpt-')) return Feature.ChatAPI
  if (/^o\d/.test(modelId)) return Feature.ChatAPI
  if (modelId.startsWith('text-embedding')) return Feature.Embeddings
  if (modelId.startsWith('tts')) return Feature.TextToSpeech
  if (modelId.startsWith('whisper')) return Feature.SpeechToText
  if (modelId.startsWith('dall-e') || modelId.includes('image'))
    return Feature.TextToImage
  return Feature.Unknown // A sensible default
}

// Helper function to determine feature options based on our knowledge
const getFeatureOptions = (feature: Feature) => {
  switch (feature) {
    case Feature.ChatAPI:
      return { streaming: true, json: true }
    case Feature.TextToSpeech:
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

  // Step 1: Get all model IDs from the provider
  const providerModelIds = modelsList.data.map(
    (model) => `${providerId}:${model.id}`
  )

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

  // Step 5: Upsert current models
  const modelsToUpsert = modelsList.data.map((model) => {
    const feature = getFeature(model.id)
    return {
      id: `${providerId}:${model.id}`,
      displayName: getDisplayName(model.id),
      provider: providerId,
      model: model.id,
      feature: feature,
      connection: providerId,
      priority: model.created,
      featureOptions: getFeatureOptions(feature),
    }
  })

  console.log('--- Discovered OpenAI Models to be upserted ---')
  console.log(JSON.stringify(modelsToUpsert, null, 2))
  console.log('-------------------------------------------')

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
          connection: sql`excluded.connection`,
          priority: sql`excluded.priority`,
          featureOptions: sql`excluded.feature_options`,
        },
      })
    console.log(`Upserted ${modelsToUpsert.length} models into the database.`)
  } else {
    console.log('No models found to upsert.')
  }

  return modelsToUpsert
}
