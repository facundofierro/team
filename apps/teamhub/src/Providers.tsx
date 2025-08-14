'use client'

import { ReactiveProvider } from '@drizzle/reactive'
import { TRPCReactProvider } from './lib/trpc-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ReactiveProvider
        config={{
          relations: {
            // Same relations config as server-side
            agent: [
              'organization.id',
              'message.fromAgentId',
              'message.toAgentId',
            ],
            organization: ['agent.organizationId', 'tool.organizationId'],
            message: ['agent.fromAgentId', 'agent.toAgentId'],
            tool: ['organization.id'],
            user: ['organization.userId'],
            message_type: ['organization.id'],
            tool_type: [],
            cron: ['organization.id', 'message.messageId'],
          },
        }}
      >
        {children}
      </ReactiveProvider>
    </TRPCReactProvider>
  )
}
