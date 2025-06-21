import { db } from '../db'
import * as schema from '../db/schema'
import { Feature, FeatureOptions } from '../modelRegistry'
import { sql, inArray } from 'drizzle-orm'
import axios from 'axios'

const gateway = 'eden'

interface EdenAiProviderSubfeature {
  provider: {
    name: string
    fullname: string
  }
  feature: {
    name: string
  }
  subfeature: {
    name: string
    fullname: string
  }
  models: {
    models: string[]
    default_model: string | null
  }
  is_working: boolean
  version?: string
  pricings?: any[]
  llm_details?: Record<string, any>
  constraints?: Record<string, any>
  languages?: any[]
  description_title?: string | null
  description_content?: string
  phase?: string
}

async function fetchProviderSubfeatures(): Promise<EdenAiProviderSubfeature[]> {
  const url = 'https://api.edenai.run/v2/info/provider_subfeatures'
  const response = await axios.get<EdenAiProviderSubfeature[]>(url)
  return response.data
}

// Helper function to generate display names
const getDisplayName = (
  providerName: string,
  subfeatureName: string
): string => {
  return `${providerName} - ${subfeatureName}`
}

export const discover = async () => {
  const providerSubfeatures = await fetchProviderSubfeatures()

  const allModelsWithOriginal = providerSubfeatures
    .filter((item) => item.is_working)
    .map((item) => {
      const featureOptions: FeatureOptions = {
        default_model: item.models.default_model,
        version: item.version,
        pricings: item.pricings,
        llm_details: item.llm_details,
        constraints: item.constraints,
        languages: item.languages,
        description_title: item.description_title,
        description_content: item.description_content,
      }

      // remove undefined values
      Object.keys(featureOptions).forEach(
        (key) =>
          featureOptions[key as keyof FeatureOptions] === undefined &&
          delete featureOptions[key as keyof FeatureOptions]
      )

      return {
        id: `${gateway}:${item.provider.name}:${item.feature.name}:${
          item.subfeature.name
        }${item.version ? `:${item.version}` : ''}${
          item.phase ? `:${item.phase}` : ''
        }`,
        originalItem: item,
        displayName: getDisplayName(
          item.provider.fullname,
          item.subfeature.fullname
        ),
        provider: gateway,
        model: `${item.provider.name}/${item.subfeature.name}`,
        feature: item.feature.name,
        subfeature: item.subfeature.name,
        gateway: gateway,
        priority: Math.floor(Date.now() / 1000), // Using current time for priority
        availableModels: item.models.models,
        featureOptions: featureOptions,
      }
    })

  const modelsById = new Map<string, any[]>()
  allModelsWithOriginal.forEach((model) => {
    if (!modelsById.has(model.id)) {
      modelsById.set(model.id, [])
    }
    modelsById.get(model.id)!.push(model)
  })

  const duplicates = Array.from(modelsById.entries()).filter(
    ([, models]) => models.length > 1
  )

  if (duplicates.length > 0) {
    console.log('--- Found Duplicate Eden AI Model IDs ---')
    for (const [id, models] of duplicates) {
      console.log(`\nDuplicate ID: "${id}" found for ${models.length} items:`)
      console.log(
        JSON.stringify(
          models.map((m) => ({
            id: m.id,
            name: m.originalItem.name,
            originalItem: m.originalItem,
          })),
          null,
          2
        )
      )
    }
    console.log('-------------------------------------------')
    console.error(
      'Duplicates found. Aborting discovery to prevent database errors.'
    )
    return []
  }

  const allModels = allModelsWithOriginal.map((model) => {
    const { originalItem, ...rest } = model
    return rest
  })

  const providerModelIds = allModels.map((model) => model.id)

  const dbModels = await db
    .select({ id: schema.models.id })
    .from(schema.models)
    .where(sql`${schema.models.provider} = ${gateway}`)

  const dbModelIds = dbModels.map((model) => model.id)

  const modelsToDelete = dbModelIds.filter(
    (id) => !providerModelIds.includes(id)
  )

  if (modelsToDelete.length > 0) {
    console.log('--- Deleting obsolete Eden AI Models ---')
    console.log(JSON.stringify(modelsToDelete, null, 2))
    console.log('------------------------------------')
    await db
      .delete(schema.models)
      .where(inArray(schema.models.id, modelsToDelete))
  }

  const modelsToUpsert = allModels

  console.log('--- Discovered Eden AI Models to be upserted ---')
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
          availableModels: sql`excluded.available_models`,
          featureOptions: sql`excluded.feature_options`,
        },
      })
    console.log(
      `Upserted ${modelsToUpsert.length} Eden AI models into the database.`
    )
  } else {
    console.log('No Eden AI models found to upsert.')
  }

  return modelsToUpsert
}
