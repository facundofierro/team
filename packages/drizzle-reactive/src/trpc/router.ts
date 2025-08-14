/**
 * Simple tRPC router integration for reactive functions
 *
 * This is just a thin wrapper that:
 * 1. Takes reactive functions
 * 2. Exposes them as tRPC procedures
 * 3. That's it!
 *
 * All the reactive logic (caching, invalidation, etc.) is handled
 * by the reactive functions themselves.
 */

import { initTRPC } from '@trpc/server'
import type { ReactiveDb } from '../core/types'
import type { ReactiveFunction } from '../core/function'

export interface ReactiveRouterConfig {
  db: ReactiveDb
}

/**
 * Simple reactive tRPC router - just exposes reactive functions as tRPC procedures
 */
export class ReactiveRouter {
  private t: ReturnType<typeof initTRPC.create>
  private db: ReactiveDb
  private procedures = new Map<string, any>()

  constructor(config: ReactiveRouterConfig) {
    this.db = config.db
    this.t = initTRPC.context<any>().create()
  }

  /**
   * Add a reactive function as a tRPC query
   * Uses the function's name automatically
   */
  addQuery<TInput, TOutput>(
    reactiveFunction: ReactiveFunction<TInput, TOutput>
  ) {
    const name = reactiveFunction.config.name
    const procedure = this.t.procedure
      .input(reactiveFunction.config.input)
      .query(reactiveFunction.getTrpcHandler(this.db))

    this.procedures.set(name, procedure)
    return this
  }

  /**
   * Add a reactive function as a tRPC mutation
   * Uses the function's name automatically
   */
  addMutation<TInput, TOutput>(
    reactiveFunction: ReactiveFunction<TInput, TOutput>
  ) {
    const name = reactiveFunction.config.name
    const procedure = this.t.procedure
      .input(reactiveFunction.config.input)
      .mutation(reactiveFunction.getTrpcHandler(this.db))

    this.procedures.set(name, procedure)
    return this
  }

  /**
   * Add a reactive function as a tRPC query with custom name (optional override)
   */
  addQueryWithName<TInput, TOutput>(
    name: string,
    reactiveFunction: ReactiveFunction<TInput, TOutput>
  ) {
    const procedure = this.t.procedure
      .input(reactiveFunction.config.input)
      .query(reactiveFunction.getTrpcHandler(this.db))

    this.procedures.set(name, procedure)
    return this
  }

  /**
   * Add a reactive function as a tRPC mutation with custom name (optional override)
   */
  addMutationWithName<TInput, TOutput>(
    name: string,
    reactiveFunction: ReactiveFunction<TInput, TOutput>
  ) {
    const procedure = this.t.procedure
      .input(reactiveFunction.config.input)
      .mutation(reactiveFunction.getTrpcHandler(this.db))

    this.procedures.set(name, procedure)
    return this
  }

  /**
   * Build the final tRPC router
   */
  build() {
    const routerObj: Record<string, any> = {}

    for (const [name, procedure] of this.procedures) {
      // Support nested router structure (e.g., 'users.getAll' -> { users: { getAll: procedure } })
      const parts = name.split('.')
      let current = routerObj

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }

      current[parts[parts.length - 1]] = procedure
    }

    return this.t.router(routerObj)
  }

  /**
   * Get registered procedure names
   */
  getProcedureNames(): string[] {
    return Array.from(this.procedures.keys())
  }

  /**
   * Get router statistics
   */
  getStats() {
    return {
      totalProcedures: this.procedures.size,
      procedureNames: this.getProcedureNames(),
    }
  }
}

/**
 * Create a reactive tRPC router (simple factory function)
 */
export function createReactiveRouter(
  config: ReactiveRouterConfig
): ReactiveRouter {
  return new ReactiveRouter(config)
}

/**
 * Helper to create a router from a collection of reactive functions
 */
export function createRouterFromFunctions(
  db: ReactiveDb,
  functions: Record<
    string,
    { type: 'query' | 'mutation'; fn: ReactiveFunction }
  >
): ReactiveRouter {
  const router = createReactiveRouter({ db })

  for (const [name, { type, fn }] of Object.entries(functions)) {
    if (type === 'query') {
      // Use custom name if provided, otherwise use function's name
      if (name !== fn.config.name) {
        router.addQueryWithName(name, fn)
      } else {
        router.addQuery(fn)
      }
    } else {
      // Use custom name if provided, otherwise use function's name
      if (name !== fn.config.name) {
        router.addMutationWithName(name, fn)
      } else {
        router.addMutation(fn)
      }
    }
  }

  return router
}
