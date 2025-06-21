import OpenAI from 'openai'
import { db } from '../db'
import * as schema from '../db/schema'
import { Feature, Subfeature } from '../modelRegistry'
import { sql, eq, inArray } from 'drizzle-orm'

// Helper function to generate display names for Deepseek models
const getDisplayName = (modelId: string): string => {
  const names: Record<string, string> = {
    'deepseek-chat': 'DeepSeek Chat',
    'deepseek-reasoner': 'DeepSeek Reasoner',
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
const getFeature = (
  modelId: string
): { feature: Feature; subfeature: Subfeature } => {
  if (modelId.includes('chat') || modelId.includes('reasoner')) {
    return { feature: Feature.Llm, subfeature: Subfeature.Chat }
  }
  return { feature: Feature.Llm, subfeature: Subfeature.Chat }
}

// Helper function to determine feature options based on our knowledge
const getFeatureOptions = (feature: Feature) => {
  if (feature === Feature.Llm) {
    return { streaming: true, json: true }
  }
  return {}
}

export const discover = async () => {
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  })

  const modelsList = await deepseek.models.list()
  const providerId = 'deepseek'

  const providerModelIds = modelsList.data.map(
    (model) => `${providerId}:${model.id}`
  )

  const dbModels = await db
    .select({ id: schema.models.id })
    .from(schema.models)
    .where(eq(schema.models.provider, providerId))
  const dbModelIds = dbModels.map((model) => model.id)

  const modelsToDelete = dbModelIds.filter(
    (id) => !providerModelIds.includes(id)
  )

  if (modelsToDelete.length > 0) {
    console.log('--- Deleting obsolete Deepseek Models ---')
    console.log(JSON.stringify(modelsToDelete, null, 2))
    console.log('------------------------------------')
    await db
      .delete(schema.models)
      .where(inArray(schema.models.id, modelsToDelete))
  }

  const modelsToUpsert = modelsList.data.map((model) => {
    const { feature, subfeature } = getFeature(model.id)
    return {
      id: `${providerId}:${model.id}`,
      displayName: getDisplayName(model.id),
      provider: providerId,
      model: model.id,
      feature: feature,
      subfeature: subfeature,
      connection: providerId,
      // Deepseek API does not provide a creation date, so we use current time for priority
      priority: Math.floor(Date.now() / 1000),
      featureOptions: getFeatureOptions(feature),
      availableModels: [],
    }
  })

  console.log('--- Discovered Deepseek Models to be upserted ---')
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
          subfeature: sql`excluded.subfeature`,
          connection: sql`excluded.connection`,
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
