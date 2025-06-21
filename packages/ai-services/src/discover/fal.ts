import { db } from '../db'
import * as schema from '../db/schema'
import { Feature, Subfeature } from '../modelRegistry'
import { sql, eq, inArray } from 'drizzle-orm'

// Since Fal does not provide a model discovery API, we maintain a hardcoded list.
// This list is based on the models available in their gallery.
const falModels = [
  {
    modelId: 'fal-ai/veo3',
    displayName: 'Google Veo 3',
    feature: Feature.Video,
    subfeature: Subfeature.GenerationAsync,
    featureOptions: {},
    priority: 100,
  },
  {
    modelId: 'fal-ai/kling-video/v2.1/master/image-to-video',
    displayName: 'Kling 2.1 Master',
    feature: Feature.Video,
    subfeature: Subfeature.GenerationAsync,
    featureOptions: {},
    priority: 90,
  },
  {
    modelId: 'fal-ai/flux-pro/kontext',
    displayName: 'FLUX.1 Kontext Pro',
    feature: Feature.Image,
    subfeature: Subfeature.Generation,
    featureOptions: { streaming: true },
    priority: 80,
  },
  {
    modelId: 'fal-ai/stable-diffusion-v35-large',
    displayName: 'Stable Diffusion 3.5 Large',
    feature: Feature.Image,
    subfeature: Subfeature.Generation,
    featureOptions: { streaming: true },
    priority: 70,
  },
  {
    modelId: 'fal-ai/playai/tts/dialog',
    displayName: 'PlayAI TTS Dialog',
    feature: Feature.Audio,
    subfeature: Subfeature.TextToSpeech,
    featureOptions: { streaming: true },
    priority: 60,
  },
  {
    modelId: 'fal-ai/photomaker',
    displayName: 'PhotoMaker',
    feature: Feature.Image,
    subfeature: Subfeature.Generation,
    featureOptions: {},
    priority: 50,
  },
  {
    modelId: 'fal-ai/hidream-i1-full',
    displayName: 'HiDream I1 Full',
    feature: Feature.Image,
    subfeature: Subfeature.Generation,
    featureOptions: { streaming: true },
    priority: 40,
  },
  {
    modelId: 'fal-ai/video-understanding',
    displayName: 'Video Understanding',
    feature: Feature.Video,
    subfeature: Subfeature.QuestionAnswer,
    featureOptions: {},
    priority: 30,
  },
]

export const discover = async () => {
  const providerId = 'fal'

  const providerModelIds = falModels.map(
    (model) => `${providerId}:${model.modelId}`
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
    console.log('--- Deleting obsolete Fal Models ---')
    console.log(JSON.stringify(modelsToDelete, null, 2))
    console.log('------------------------------------')
    await db
      .delete(schema.models)
      .where(inArray(schema.models.id, modelsToDelete))
  }

  const modelsToUpsert = falModels.map((model) => ({
    id: `${providerId}:${model.modelId}`,
    displayName: model.displayName,
    provider: providerId,
    model: model.modelId,
    feature: model.feature,
    subfeature: model.subfeature,
    gateway: providerId,
    priority: model.priority,
    featureOptions: model.featureOptions,
    availableModels: [],
  }))

  console.log('--- Discovered Fal Models to be upserted ---')
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
