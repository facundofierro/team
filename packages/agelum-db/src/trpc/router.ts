import { createReactiveRouter } from '@drizzle/reactive/server'
import { reactiveDb } from '../db'
import * as agentFunctions from '../db/functions/reactive/agents'
import * as organizationFunctions from '../db/functions/reactive/organizations'
import * as agencyFunctions from '../db/functions/reactive/agency'

// Create router lazily to avoid build-time database connection issues
let _appRouter: any = null

function createAppRouter() {
  if (_appRouter) return _appRouter

  try {
    const reactiveRouter = createReactiveRouter({ db: reactiveDb })
      // Agent procedures
      .addQuery(agentFunctions.getAgents) // -> agents.getAll
      .addQuery(agentFunctions.getAgent) // -> agents.getOne
      .addMutation(agentFunctions.createAgent) // -> agents.create
      .addMutation(agentFunctions.updateAgent) // -> agents.update
      .addMutation(agentFunctions.deleteAgent) // -> agents.delete
      .addQuery(agentFunctions.getAgentMessages) // -> agents.messages.getAll
      .addQuery(agentFunctions.getAgentMemories) // -> agents.memory.getAll
      // Conversation state management
      .addMutation(agentFunctions.updateAgentConversationState) // -> agents.updateConversationState
      .addQuery(agentFunctions.getAgentWithConversationState) // -> agents.getWithConversationState
      .addQuery(agentFunctions.getAgentsWithConversationState) // -> agents.getAllWithConversationState
      
      // Conversation memory functions
      .addQuery(agentFunctions.getConversationMemory) // -> conversations.getOne
      .addQuery(agentFunctions.getActiveConversation) // -> conversations.getActive

      // Organization procedures
      .addQuery(organizationFunctions.getOrganizations) // -> organizations.getAll
      .addQuery(organizationFunctions.getOrganization) // -> organizations.getOne
      .addMutation(organizationFunctions.createOrganization) // -> organizations.create
      .addQuery(organizationFunctions.getOrganizationSettings) // -> organizations.settings.getAll
      .addMutation(organizationFunctions.updateOrganizationSettings) // -> organizations.settings.update

      // Agency procedures (migrated from old agency.ts)
      .addMutation(agencyFunctions.createMessage) // -> messages.create
      .addQuery(agencyFunctions.getMessage) // -> messages.getOne
      .addQuery(agencyFunctions.getAgentMessages) // -> agents.messages.getAll
      .addQuery(agencyFunctions.getTool) // -> tools.getOne
      .addMutation(agencyFunctions.createTool) // -> tools.create
      .addQuery(agencyFunctions.getActiveTools) // -> tools.getAllActive
      .addMutation(agencyFunctions.createAgent) // -> agents.create
      .addMutation(agencyFunctions.updateAgent) // -> agents.update
      .addMutation(agencyFunctions.createOrganization) // -> organizations.create
      .addMutation(agencyFunctions.updateOrganizationSettings) // -> organizations.settings.update
      .addMutation(agencyFunctions.updateMessage) // -> messages.update
      .addMutation(agencyFunctions.createCron) // -> cron.create
      .addQuery(agencyFunctions.getActiveCrons) // -> cron.getAllActive
      .addQuery(agencyFunctions.getCron) // -> cron.getOne
      .addMutation(agencyFunctions.updateCronLastRun) // -> cron.updateLastRun
      .addQuery(agencyFunctions.verifyToolUsage) // -> tools.verifyUsage

    // Build the actual tRPC router
    _appRouter = reactiveRouter.build()

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

// Export the proper type - this should be the built tRPC router type
export type AppRouter = NonNullable<ReturnType<typeof createAppRouter>>
