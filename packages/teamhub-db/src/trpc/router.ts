import { createReactiveRouter } from '@drizzle/reactive/server'
import { reactiveDb } from '../db'
import * as agentFunctions from '../db/functions/reactive/agents'
import * as organizationFunctions from '../db/functions/reactive/organizations'

// Create router lazily to avoid build-time database connection issues
let _appRouter: any = null

function createAppRouter() {
  if (_appRouter) return _appRouter

  try {
    _appRouter = createReactiveRouter({ db: reactiveDb })
      // Agent procedures
      .addQuery(agentFunctions.getAgents) // -> agents.getAll
      .addQuery(agentFunctions.getAgent) // -> agents.getOne
      .addMutation(agentFunctions.createAgent) // -> agents.create
      .addMutation(agentFunctions.updateAgent) // -> agents.update
      .addMutation(agentFunctions.deleteAgent) // -> agents.delete
      .addQuery(agentFunctions.getAgentMessages) // -> agents.messages.getAll

      // Organization procedures
      .addQuery(organizationFunctions.getOrganizations) // -> organizations.getAll
      .addQuery(organizationFunctions.getOrganization) // -> organizations.getOne
      .addMutation(organizationFunctions.createOrganization) // -> organizations.create
      .addQuery(organizationFunctions.getOrganizationSettings) // -> organizations.settings.getAll
      .addMutation(organizationFunctions.updateOrganizationSettings) // -> organizations.settings.update
      .build() // Build the actual tRPC router

    return _appRouter
  } catch (error) {
    console.warn('⚠️ Failed to create tRPC router during build:', error)
    return null
  }
}

// Export router with lazy initialization
export const appRouter = new Proxy({} as any, {
  get(target, prop) {
    const router = createAppRouter()
    return router?.[prop]
  },
})

export type AppRouter = typeof _appRouter
