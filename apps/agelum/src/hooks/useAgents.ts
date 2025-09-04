'use client'

import { useQuery } from '@tanstack/react-query'
import type { Agent } from '@agelum/db'

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents')
      return response.json() as Promise<Agent[]>
    },
  })
}
