import { discover as discoverOpenAI } from './discover/openai'
import { discover as discoverFal } from './discover/fal'
import { discover as discoverEden } from './discover/eden'
import { discover as discoverDeepseek } from './discover/deepseek'

export const discover = async (provider: string) => {
  switch (provider) {
    case 'openai':
      return await discoverOpenAI()
    case 'fal':
      return await discoverFal()
    case 'eden':
      return await discoverEden()
    case 'deepseek':
      return await discoverDeepseek()
    default:
      return []
  }
}
