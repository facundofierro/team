export { default as db } from './db/index'
export { reactiveDb } from './db/index'

export * from './db/index'

// Export reactive functions with aliased names to avoid conflicts
export * as reactive from './db/functions/reactive'
export { appRouter, type AppRouter } from './trpc/router'

// Export client-safe reactive configuration
export { reactiveRelations } from './reactive-config'
