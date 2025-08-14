import { createReactiveRouter } from '@drizzle/reactive'
import { reactiveDb } from '../db'
import * as agentFunctions from '../db/functions/reactive/agents'
import * as organizationFunctions from '../db/functions/reactive/organizations'

export const appRouter = createReactiveRouter({ db: reactiveDb })
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

export type AppRouter = typeof appRouter
