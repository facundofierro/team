import { db } from '../db'
import * as schema from '../db/schema'
import { Feature, FeatureOptions } from '../modelRegistry'
import { sql, inArray } from 'drizzle-orm'
import axios from 'axios'

const PROVIDER_ID = 'eden'

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

  const allModels = providerSubfeatures
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
        id: `${PROVIDER_ID}:${item.provider.name}:${item.subfeature.name}`,
        displayName: getDisplayName(
          item.provider.fullname,
          item.subfeature.fullname
        ),
        provider: PROVIDER_ID,
        model: `${item.provider.name}/${item.subfeature.name}`,
        feature: item.feature.name,
        subfeature: item.subfeature.name,
        connection: PROVIDER_ID,
        priority: Math.floor(Date.now() / 1000), // Using current time for priority
        availableModels: item.models.models,
        featureOptions: featureOptions,
      }
    })

  const providerModelIds = allModels.map((model) => model.id)

  const dbModels = await db
    .select({ id: schema.models.id })
    .from(schema.models)
    .where(sql`${schema.models.provider} = ${PROVIDER_ID}`)

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
          connection: sql`excluded.connection`,
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
