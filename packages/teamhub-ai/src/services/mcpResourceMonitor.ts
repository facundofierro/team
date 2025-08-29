import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface ResourceUsage {
  organizationId: string
  containerId: string
  containerName: string
  cpuPercent: number
  memoryUsage: string // e.g., "512MiB"
  memoryLimit: string // e.g., "1GiB"
  memoryPercent: number
  networkIn: string // e.g., "1.2MB"
  networkOut: string // e.g., "850kB"
  blockIn: string // e.g., "10MB"
  blockOut: string // e.g., "2MB"
  pids: number // Number of processes
  timestamp: Date
}

export interface ResourceLimits {
  organizationId: string
  memoryLimit: string // e.g., "1G"
  cpuLimit: string // e.g., "0.5"
  maxMCPs: number
  storageLimit: string // e.g., "2G"
  networkLimitMB: number // Monthly limit in MB
}

export interface ResourceAlert {
  organizationId: string
  type: 'memory' | 'cpu' | 'storage' | 'network' | 'mcps'
  severity: 'warning' | 'critical'
  message: string
  currentValue: number
  limitValue: number
  timestamp: Date
}

export interface OrganizationResourceSummary {
  organizationId: string
  containerStatus: 'running' | 'stopped' | 'not_found'
  resourceUsage?: ResourceUsage
  limits: ResourceLimits
  mcpCount: number
  alerts: ResourceAlert[]
  lastUpdated: Date
}

export class MCPResourceMonitor {
  private static instance: MCPResourceMonitor
  private monitoring = false
  private monitoringInterval?: NodeJS.Timeout
  private readonly intervalMs = 30000 // 30 seconds

  // Default resource limits
  private readonly defaultLimits: Omit<ResourceLimits, 'organizationId'> = {
    memoryLimit: '1G',
    cpuLimit: '0.5',
    maxMCPs: 10,
    storageLimit: '2G',
    networkLimitMB: 1000, // 1GB per month
  }

  private constructor() {}

  static getInstance(): MCPResourceMonitor {
    if (!MCPResourceMonitor.instance) {
      MCPResourceMonitor.instance = new MCPResourceMonitor()
    }
    return MCPResourceMonitor.instance
  }

  /**
   * Parse Docker stats output
   */
  private parseDockerStats(statsLine: string): Partial<ResourceUsage> | null {
    try {
      // Docker stats format: CONTAINER ID,NAME,CPU %,MEM USAGE / LIMIT,MEM %,NET I/O,BLOCK I/O,PIDS
      const parts = statsLine.split(',')
      if (parts.length < 8) return null

      const [
        containerId,
        containerName,
        cpuPercent,
        memUsage,
        memPercent,
        netIO,
        blockIO,
        pids,
      ] = parts

      // Parse memory usage (e.g., "512MiB / 1GiB")
      const memParts = memUsage.split(' / ')
      const memoryUsage = memParts[0]?.trim() || '0B'
      const memoryLimit = memParts[1]?.trim() || '0B'

      // Parse network I/O (e.g., "1.2MB / 850kB")
      const netParts = netIO.split(' / ')
      const networkIn = netParts[0]?.trim() || '0B'
      const networkOut = netParts[1]?.trim() || '0B'

      // Parse block I/O (e.g., "10MB / 2MB")
      const blockParts = blockIO.split(' / ')
      const blockIn = blockParts[0]?.trim() || '0B'
      const blockOut = blockParts[1]?.trim() || '0B'

      return {
        containerId: containerId.trim(),
        containerName: containerName.trim(),
        cpuPercent: parseFloat(cpuPercent.replace('%', '')) || 0,
        memoryUsage,
        memoryLimit,
        memoryPercent: parseFloat(memPercent.replace('%', '')) || 0,
        networkIn,
        networkOut,
        blockIn,
        blockOut,
        pids: parseInt(pids) || 0,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Error parsing Docker stats:', error)
      return null
    }
  }

  /**
   * Get resource usage for a specific organization's container
   */
  async getResourceUsage(
    organizationId: string
  ): Promise<ResourceUsage | null> {
    try {
      const containerName = `teamhub-mcp-${organizationId}`

      // Get stats for specific container
      const { stdout } = await execAsync(
        `docker stats ${containerName} --no-stream --format "table {{.Container}},{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}},{{.BlockIO}},{{.PIDs}}"`
      )

      const lines = stdout.trim().split('\n')
      if (lines.length < 2) return null // No data line after header

      const statsData = this.parseDockerStats(lines[1])
      if (!statsData) return null

      return {
        organizationId,
        ...statsData,
      } as ResourceUsage
    } catch (error) {
      // Container might not be running or doesn't exist
      return null
    }
  }

  /**
   * Get resource usage for all MCP containers
   */
  async getAllResourceUsage(): Promise<ResourceUsage[]> {
    try {
      // Get stats for all TeamHub MCP containers
      const { stdout } = await execAsync(
        'docker stats --no-stream --format "table {{.Container}},{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}},{{.BlockIO}},{{.PIDs}}" $(docker ps --filter name=teamhub-mcp- --format "{{.Names}}")'
      )

      const lines = stdout.trim().split('\n')
      const usageData: ResourceUsage[] = []

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const statsData = this.parseDockerStats(lines[i])
        if (statsData && statsData.containerName?.startsWith('teamhub-mcp-')) {
          const organizationId = statsData.containerName.replace(
            'teamhub-mcp-',
            ''
          )
          usageData.push({
            organizationId,
            ...statsData,
          } as ResourceUsage)
        }
      }

      return usageData
    } catch (error) {
      console.error('Error getting all resource usage:', error)
      return []
    }
  }

  /**
   * Get resource limits for an organization
   */
  getResourceLimits(
    organizationId: string,
    customLimits?: Partial<ResourceLimits>
  ): ResourceLimits {
    return {
      organizationId,
      ...this.defaultLimits,
      ...customLimits,
    }
  }

  /**
   * Check for resource alerts
   */
  checkResourceAlerts(
    usage: ResourceUsage,
    limits: ResourceLimits,
    mcpCount: number
  ): ResourceAlert[] {
    const alerts: ResourceAlert[] = []

    // Memory alerts
    if (usage.memoryPercent > 90) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'memory',
        severity: 'critical',
        message: `Memory usage is critically high: ${usage.memoryPercent.toFixed(
          1
        )}%`,
        currentValue: usage.memoryPercent,
        limitValue: 100,
        timestamp: new Date(),
      })
    } else if (usage.memoryPercent > 75) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'memory',
        severity: 'warning',
        message: `Memory usage is high: ${usage.memoryPercent.toFixed(1)}%`,
        currentValue: usage.memoryPercent,
        limitValue: 100,
        timestamp: new Date(),
      })
    }

    // CPU alerts
    if (usage.cpuPercent > 90) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'cpu',
        severity: 'critical',
        message: `CPU usage is critically high: ${usage.cpuPercent.toFixed(
          1
        )}%`,
        currentValue: usage.cpuPercent,
        limitValue: 100,
        timestamp: new Date(),
      })
    } else if (usage.cpuPercent > 75) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'cpu',
        severity: 'warning',
        message: `CPU usage is high: ${usage.cpuPercent.toFixed(1)}%`,
        currentValue: usage.cpuPercent,
        limitValue: 100,
        timestamp: new Date(),
      })
    }

    // MCP count alerts
    if (mcpCount >= limits.maxMCPs) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'mcps',
        severity: 'critical',
        message: `Maximum MCP limit reached: ${mcpCount}/${limits.maxMCPs}`,
        currentValue: mcpCount,
        limitValue: limits.maxMCPs,
        timestamp: new Date(),
      })
    } else if (mcpCount >= limits.maxMCPs * 0.8) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'mcps',
        severity: 'warning',
        message: `Approaching MCP limit: ${mcpCount}/${limits.maxMCPs}`,
        currentValue: mcpCount,
        limitValue: limits.maxMCPs,
        timestamp: new Date(),
      })
    }

    // Process count alerts (potential resource exhaustion)
    if (usage.pids > 100) {
      alerts.push({
        organizationId: usage.organizationId,
        type: 'cpu',
        severity: 'warning',
        message: `High process count: ${usage.pids} processes`,
        currentValue: usage.pids,
        limitValue: 100,
        timestamp: new Date(),
      })
    }

    return alerts
  }

  /**
   * Get comprehensive resource summary for an organization
   */
  async getOrganizationResourceSummary(
    organizationId: string,
    customLimits?: Partial<ResourceLimits>
  ): Promise<OrganizationResourceSummary> {
    const limits = this.getResourceLimits(organizationId, customLimits)

    try {
      // Import here to avoid circular dependencies
      const { MCPContainerManager } = await import('./mcpContainerManager')
      const containerManager = MCPContainerManager.getInstance()

      // Check if container exists and is running
      const containerExists = await containerManager.containerExists(
        organizationId
      )
      const isRunning = await containerManager.isContainerRunning(
        organizationId
      )

      let containerStatus: 'running' | 'stopped' | 'not_found' = 'not_found'
      if (containerExists) {
        containerStatus = isRunning ? 'running' : 'stopped'
      }

      // Get resource usage if container is running
      let resourceUsage: ResourceUsage | undefined
      let alerts: ResourceAlert[] = []
      let mcpCount = 0

      if (isRunning) {
        const usageResult = await this.getResourceUsage(organizationId)
        resourceUsage = usageResult || undefined

        // Get MCP count
        const mcpStatuses = await containerManager.getMCPStatus(organizationId)
        mcpCount = mcpStatuses.length

        // Check for alerts
        if (resourceUsage) {
          alerts = this.checkResourceAlerts(resourceUsage, limits, mcpCount)
        }
      }

      return {
        organizationId,
        containerStatus,
        resourceUsage,
        limits,
        mcpCount,
        alerts,
        lastUpdated: new Date(),
      }
    } catch (error) {
      console.error(
        `Error getting resource summary for ${organizationId}:`,
        error
      )

      return {
        organizationId,
        containerStatus: 'not_found',
        limits,
        mcpCount: 0,
        alerts: [],
        lastUpdated: new Date(),
      }
    }
  }

  /**
   * Get resource summaries for all organizations
   */
  async getAllOrganizationSummaries(): Promise<OrganizationResourceSummary[]> {
    try {
      // Get all TeamHub MCP containers
      const { stdout } = await execAsync(
        'docker ps -a --filter name=teamhub-mcp- --format "{{.Names}}"'
      )
      const containerNames = stdout
        .trim()
        .split('\n')
        .filter((name) => name.trim())

      const summaries: OrganizationResourceSummary[] = []

      for (const containerName of containerNames) {
        if (containerName.startsWith('teamhub-mcp-')) {
          const organizationId = containerName.replace('teamhub-mcp-', '')
          const summary = await this.getOrganizationResourceSummary(
            organizationId
          )
          summaries.push(summary)
        }
      }

      return summaries
    } catch (error) {
      console.error('Error getting all organization summaries:', error)
      return []
    }
  }

  /**
   * Start periodic resource monitoring
   */
  startMonitoring() {
    if (this.monitoring) {
      console.log('Resource monitoring is already running')
      return
    }

    console.log('Starting MCP resource monitoring...')
    this.monitoring = true

    this.monitoringInterval = setInterval(async () => {
      try {
        const summaries = await this.getAllOrganizationSummaries()

        // Log critical alerts
        summaries.forEach((summary) => {
          const criticalAlerts = summary.alerts.filter(
            (alert) => alert.severity === 'critical'
          )
          if (criticalAlerts.length > 0) {
            console.warn(`🚨 Critical alerts for ${summary.organizationId}:`)
            criticalAlerts.forEach((alert) => {
              console.warn(`  - ${alert.type.toUpperCase()}: ${alert.message}`)
            })
          }
        })

        // TODO: Store metrics in database or send to monitoring system
        // TODO: Send notifications for critical alerts
      } catch (error) {
        console.error('Error during resource monitoring:', error)
      }
    }, this.intervalMs)

    console.log(
      `✅ Resource monitoring started (interval: ${this.intervalMs / 1000}s)`
    )
  }

  /**
   * Stop periodic resource monitoring
   */
  stopMonitoring() {
    if (!this.monitoring) {
      console.log('Resource monitoring is not running')
      return
    }

    console.log('Stopping MCP resource monitoring...')
    this.monitoring = false

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }

    console.log('✅ Resource monitoring stopped')
  }

  /**
   * Check if monitoring is active
   */
  isMonitoring(): boolean {
    return this.monitoring
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      active: this.monitoring,
      intervalMs: this.intervalMs,
      nextCheck: this.monitoringInterval
        ? new Date(Date.now() + this.intervalMs)
        : null,
    }
  }
}
