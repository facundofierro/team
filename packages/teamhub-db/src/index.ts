// Export the enhanced db as default
export { default as db } from './db/index'
export { authAdapter } from './db/authAdapter'

// Type exports
export * from './db'
export * from './db/schema'
export * from './db/functions/agency'
export * from './db/types'
export * from './db/constants'

export { insights } from './db/index'
export { embeddings } from './db/index'
export { memories } from './db/index'
