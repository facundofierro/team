import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export interface MCPContainerConfig {
  organizationId: string
  memoryLimit: string // e.g., "1G"
  cpuLimit: string // e.g., "0.5"
  maxMCPs: number // e.g., 10
  dataPath: string // Host path for data persistence
  logsPath: string // Host path for logs
}

export interface MCPInstallRequest {
  name: string
  source: string // GitHub URL or npm package
  configuration: Record<string, string>
}

export interface MCPStatus {
  name: string
  status: 'installed' | 'running' | 'stopped' | 'failed'
  pid?: number
  port?: number
  lastStarted?: Date
  error?: string
}

export interface ContainerInfo {
  organizationId: string
  containerId: string
  status: 'running' | 'stopped' | 'failed'
  created: Date
  mcpCount: number
  memoryUsage?: string
  cpuUsage?: string
}

export class MCPContainerManager {
  private static instance: MCPContainerManager
  private readonly imageTag = 'teamhub-mcp-runtime:latest'
  private readonly networkName = 'mcp-isolated'

  // Default resource limits
  private readonly defaultConfig: Omit<
    MCPContainerConfig,
    'organizationId' | 'dataPath' | 'logsPath'
  > = {
    memoryLimit: '1G',
    cpuLimit: '0.5',
    maxMCPs: 10,
  }

  private constructor() {}

  static getInstance(): MCPContainerManager {
    if (!MCPContainerManager.instance) {
      MCPContainerManager.instance = new MCPContainerManager()
    }
    return MCPContainerManager.instance
  }

  /**
   * Get container name for an organization
   */
  private getContainerName(organizationId: string): string {
    return `teamhub-mcp-${organizationId}`
  }

  /**
   * Get volume names for an organization
   */
  private getVolumeNames(organizationId: string) {
    return {
      data: `mcp-data-${organizationId}`,
      logs: `mcp-logs-${organizationId}`,
    }
  }

  /**
   * Check if Docker is available
   */
  async checkDockerAvailable(): Promise<boolean> {
    try {
      await execAsync('docker --version')
      return true
    } catch (error) {
      console.error('Docker is not available:', error)
      return false
    }
  }

  /**
   * Check if MCP runtime image is built
   */
  async checkRuntimeImageExists(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`docker images -q ${this.imageTag}`)
      return stdout.trim().length > 0
    } catch (error) {
      console.error('Error checking runtime image:', error)
      return false
    }
  }

  /**
   * Build the MCP runtime image
   */
  async buildRuntimeImage(): Promise<void> {
    console.log('Building MCP runtime image...')

    const buildScript = path.join(
      process.cwd(),
      'infrastructure/docker/build-mcp-runtime.sh'
    )

    return new Promise((resolve, reject) => {
      const buildProcess = spawn('bash', [buildScript], {
        stdio: 'pipe',
        cwd: process.cwd(),
      })

      let output = ''
      let errorOutput = ''

      buildProcess.stdout?.on('data', (data) => {
        output += data.toString()
        console.log(data.toString().trim())
      })

      buildProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString()
        console.error(data.toString().trim())
      })

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ MCP runtime image built successfully')
          resolve()
        } else {
          console.error('❌ Failed to build MCP runtime image')
          reject(new Error(`Build failed with code ${code}: ${errorOutput}`))
        }
      })
    })
  }

  /**
   * Create and setup network for MCP containers
   */
  async ensureNetwork(): Promise<void> {
    try {
      // Check if network exists
      const { stdout } = await execAsync(
        `docker network ls --filter name=${this.networkName} --format "{{.Name}}"`
      )

      if (stdout.trim() === this.networkName) {
        console.log(`Network ${this.networkName} already exists`)
        return
      }

      // Create hardened isolated network
      const networkCommand = [
        'docker network create',
        '--driver bridge',
        '--subnet=172.20.0.0/16',
        '--gateway=172.20.0.1',
        '--opt com.docker.network.bridge.name=mcp-bridge',
        '--opt com.docker.network.bridge.enable_icc=false', // Disable inter-container communication
        '--opt com.docker.network.bridge.enable_ip_masquerade=true',
        '--opt com.docker.network.driver.mtu=1500',
        `--label teamhub.network=mcp-isolated`,
        `--label teamhub.security-profile=hardened`,
        `--label teamhub.created=${new Date().toISOString()}`,
        this.networkName,
      ].join(' ')

      await execAsync(networkCommand)
      console.log(`✅ Created hardened network: ${this.networkName}`)
    } catch (error) {
      console.error('Error ensuring network:', error)
      throw error
    }
  }

  /**
   * Check if container exists for organization
   */
  async containerExists(organizationId: string): Promise<boolean> {
    try {
      const containerName = this.getContainerName(organizationId)
      const { stdout } = await execAsync(
        `docker ps -a --filter name=${containerName} --format "{{.Names}}"`
      )
      return stdout.trim() === containerName
    } catch (error) {
      return false
    }
  }

  /**
   * Check if container is running for organization
   */
  async isContainerRunning(organizationId: string): Promise<boolean> {
    try {
      const containerName = this.getContainerName(organizationId)
      const { stdout } = await execAsync(
        `docker ps --filter name=${containerName} --format "{{.Names}}"`
      )
      return stdout.trim() === containerName
    } catch (error) {
      return false
    }
  }

  /**
   * Create container for organization
   */
  async createContainer(config: MCPContainerConfig): Promise<void> {
    const containerName = this.getContainerName(config.organizationId)
    const volumes = this.getVolumeNames(config.organizationId)

    console.log(
      `Creating MCP container for organization: ${config.organizationId}`
    )

    try {
      // Ensure volumes exist
      await execAsync(`docker volume create ${volumes.data}`)
      await execAsync(`docker volume create ${volumes.logs}`)

      // Create container with enhanced security
      const dockerCommand = [
        'docker create',
        `--name ${containerName}`,

        // Resource limits
        `--memory=${config.memoryLimit}`,
        `--memory-swap=${config.memoryLimit}`, // No swap
        `--cpus=${config.cpuLimit}`,
        '--pids-limit=50',

        // Network security
        `--network=${this.networkName}`,

        // Volume mounts with security flags
        `--volume=${volumes.data}:/mcp/data`,
        `--volume=${volumes.logs}:/mcp/logs`,
        '--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=100m',
        '--tmpfs=/var/tmp:rw,noexec,nosuid,nodev,size=50m',

        // Enhanced security options
        '--security-opt=no-new-privileges:true',
        '--security-opt=apparmor:docker-default',
        '--user=1001:1001',
        '--cap-drop=ALL',
        '--cap-add=NET_BIND_SERVICE',
        '--read-only',

        // Process limits
        '--ulimit=nofile=1024:1024',
        '--ulimit=nproc=50:50',
        '--ulimit=fsize=52428800:52428800', // 50MB file size limit

        // Block device access
        '--device-cgroup-rule="a *:* rmw"', // Deny all device access

        // Environment variables
        `--env ORGANIZATION_ID=${config.organizationId}`,
        `--env MCP_MEMORY_LIMIT=${config.memoryLimit}`,
        `--env MCP_CPU_LIMIT=${config.cpuLimit}`,
        '--env NODE_ENV=production',
        '--env PYTHONUNBUFFERED=1',
        '--env PYTHONDONTWRITEBYTECODE=1',
        '--env HOME=/mcp/home',
        '--env PATH=/usr/local/bin:/usr/bin:/bin',

        // Restart policy
        '--restart=on-failure:3',

        // Health check
        '--health-cmd="sh -c \'pgrep -f node || pgrep -f python || exit 1\'"',
        '--health-interval=30s',
        '--health-timeout=10s',
        '--health-retries=3',
        '--health-start-period=60s',

        // Labels for management and monitoring
        `--label teamhub.organization=${config.organizationId}`,
        '--label teamhub.service=mcp-container',
        '--label teamhub.security-profile=hardened',
        `--label teamhub.created=${new Date().toISOString()}`,

        this.imageTag,
      ].join(' ')

      await execAsync(dockerCommand)
      console.log(`✅ Created container: ${containerName}`)
    } catch (error) {
      console.error(
        `❌ Failed to create container for ${config.organizationId}:`,
        error
      )
      throw error
    }
  }

  /**
   * Start container for organization
   */
  async startContainer(organizationId: string): Promise<void> {
    const containerName = this.getContainerName(organizationId)

    try {
      await execAsync(`docker start ${containerName}`)
      console.log(`✅ Started container: ${containerName}`)

      // Wait for container to be ready
      await this.waitForContainerReady(organizationId)
    } catch (error) {
      console.error(
        `❌ Failed to start container for ${organizationId}:`,
        error
      )
      throw error
    }
  }

  /**
   * Stop container for organization
   */
  async stopContainer(organizationId: string): Promise<void> {
    const containerName = this.getContainerName(organizationId)

    try {
      await execAsync(`docker stop ${containerName}`)
      console.log(`✅ Stopped container: ${containerName}`)
    } catch (error) {
      console.error(`❌ Failed to stop container for ${organizationId}:`, error)
      throw error
    }
  }

  /**
   * Remove container for organization
   */
  async removeContainer(organizationId: string): Promise<void> {
    const containerName = this.getContainerName(organizationId)
    const volumes = this.getVolumeNames(organizationId)

    try {
      // Stop container if running
      try {
        await execAsync(`docker stop ${containerName}`)
      } catch (error) {
        // Container might not be running
      }

      // Remove container
      await execAsync(`docker rm ${containerName}`)

      // Remove volumes
      await execAsync(`docker volume rm ${volumes.data}`)
      await execAsync(`docker volume rm ${volumes.logs}`)

      console.log(`✅ Removed container and volumes for: ${organizationId}`)
    } catch (error) {
      console.error(
        `❌ Failed to remove container for ${organizationId}:`,
        error
      )
      throw error
    }
  }

  /**
   * Wait for container to be ready
   */
  private async waitForContainerReady(
    organizationId: string,
    maxWaitMs: number = 30000
  ): Promise<void> {
    const containerName = this.getContainerName(organizationId)
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitMs) {
      try {
        // Check if container is running
        const { stdout } = await execAsync(
          `docker ps --filter name=${containerName} --format "{{.Status}}"`
        )

        if (stdout.includes('Up')) {
          console.log(`✅ Container ${containerName} is ready`)
          return
        }
      } catch (error) {
        // Continue waiting
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error(
      `Container ${containerName} failed to become ready within ${maxWaitMs}ms`
    )
  }

  /**
   * Ensure container is ready for organization
   */
  async ensureContainer(
    organizationId: string,
    customConfig?: Partial<MCPContainerConfig>
  ): Promise<void> {
    console.log(`Ensuring MCP container for organization: ${organizationId}`)

    // Check prerequisites
    if (!(await this.checkDockerAvailable())) {
      throw new Error('Docker is not available')
    }

    if (!(await this.checkRuntimeImageExists())) {
      await this.buildRuntimeImage()
    }

    await this.ensureNetwork()

    // Prepare config
    const config: MCPContainerConfig = {
      organizationId,
      dataPath: `/var/lib/teamhub/mcp/data/${organizationId}`,
      logsPath: `/var/lib/teamhub/mcp/logs/${organizationId}`,
      ...this.defaultConfig,
      ...customConfig,
    }

    // Check if container exists
    if (!(await this.containerExists(organizationId))) {
      await this.createContainer(config)
    }

    // Start container if not running
    if (!(await this.isContainerRunning(organizationId))) {
      await this.startContainer(organizationId)
    }

    console.log(`✅ Container ready for organization: ${organizationId}`)
  }

  /**
   * Execute command in organization's container
   */
  async execInContainer(
    organizationId: string,
    command: string[]
  ): Promise<{ stdout: string; stderr: string }> {
    const containerName = this.getContainerName(organizationId)

    return new Promise((resolve, reject) => {
      const dockerExec = spawn('docker', ['exec', containerName, ...command], {
        stdio: 'pipe',
      })

      let stdout = ''
      let stderr = ''

      dockerExec.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      dockerExec.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      dockerExec.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`))
        }
      })
    })
  }

  /**
   * Install MCP in organization's container
   */
  async installMCP(
    organizationId: string,
    request: MCPInstallRequest
  ): Promise<void> {
    console.log(
      `Installing MCP "${request.name}" for organization: ${organizationId}`
    )

    await this.ensureContainer(organizationId)

    try {
      const configJson = JSON.stringify(request.configuration)
      const result = await this.execInContainer(organizationId, [
        'mcp-install',
        request.name,
        request.source,
        configJson,
      ])

      console.log(`✅ MCP "${request.name}" installed successfully`)
      console.log('Install output:', result.stdout)
    } catch (error) {
      console.error(`❌ Failed to install MCP "${request.name}":`, error)
      throw error
    }
  }

  /**
   * Start MCP in organization's container
   */
  async startMCP(
    organizationId: string,
    mcpName: string,
    port?: number
  ): Promise<void> {
    console.log(`Starting MCP "${mcpName}" for organization: ${organizationId}`)

    try {
      const command = port
        ? ['mcp-start', mcpName, port.toString()]
        : ['mcp-start', mcpName]
      const result = await this.execInContainer(organizationId, command)

      console.log(`✅ MCP "${mcpName}" started successfully`)
      console.log('Start output:', result.stdout)
    } catch (error) {
      console.error(`❌ Failed to start MCP "${mcpName}":`, error)
      throw error
    }
  }

  /**
   * Stop MCP in organization's container
   */
  async stopMCP(organizationId: string, mcpName: string): Promise<void> {
    console.log(`Stopping MCP "${mcpName}" for organization: ${organizationId}`)

    try {
      const result = await this.execInContainer(organizationId, [
        'mcp-stop',
        mcpName,
      ])

      console.log(`✅ MCP "${mcpName}" stopped successfully`)
      console.log('Stop output:', result.stdout)
    } catch (error) {
      console.error(`❌ Failed to stop MCP "${mcpName}":`, error)
      throw error
    }
  }

  /**
   * Get status of all MCPs in organization's container
   */
  async getMCPStatus(organizationId: string): Promise<MCPStatus[]> {
    try {
      const result = await this.execInContainer(organizationId, [
        'find',
        '/mcp/servers',
        '-maxdepth',
        '1',
        '-type',
        'd',
        '-not',
        '-path',
        '/mcp/servers',
      ])

      const mcpDirs = result.stdout
        .trim()
        .split('\n')
        .filter((dir) => dir.trim())
      const statuses: MCPStatus[] = []

      for (const dir of mcpDirs) {
        const mcpName = path.basename(dir)
        const status = await this.getSingleMCPStatus(organizationId, mcpName)
        statuses.push(status)
      }

      return statuses
    } catch (error) {
      console.error(`Error getting MCP status for ${organizationId}:`, error)
      return []
    }
  }

  /**
   * Get status of a single MCP
   */
  private async getSingleMCPStatus(
    organizationId: string,
    mcpName: string
  ): Promise<MCPStatus> {
    try {
      // Check if PID file exists and process is running
      const pidCheckResult = await this.execInContainer(organizationId, [
        'sh',
        '-c',
        `if [ -f "/mcp/data/${mcpName}.pid" ]; then cat "/mcp/data/${mcpName}.pid"; fi`,
      ])

      const pidStr = pidCheckResult.stdout.trim()

      if (pidStr) {
        const pid = parseInt(pidStr)

        // Check if process is actually running
        try {
          await this.execInContainer(organizationId, [
            'kill',
            '-0',
            pid.toString(),
          ])

          return {
            name: mcpName,
            status: 'running',
            pid,
            lastStarted: new Date(), // TODO: Get actual start time
          }
        } catch (error) {
          return {
            name: mcpName,
            status: 'stopped',
          }
        }
      } else {
        return {
          name: mcpName,
          status: 'installed',
        }
      }
    } catch (error) {
      return {
        name: mcpName,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get container information
   */
  async getContainerInfo(
    organizationId: string
  ): Promise<ContainerInfo | null> {
    const containerName = this.getContainerName(organizationId)

    try {
      const { stdout } = await execAsync(
        `docker inspect ${containerName} --format="{{json .}}"`
      )
      const containerData = JSON.parse(stdout)

      const mcpStatuses = await this.getMCPStatus(organizationId)

      return {
        organizationId,
        containerId: containerData.Id,
        status: containerData.State.Running ? 'running' : 'stopped',
        created: new Date(containerData.Created),
        mcpCount: mcpStatuses.length,
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Cleanup unused containers
   */
  async cleanupUnusedContainers(activeOrganizations: string[]): Promise<void> {
    console.log('Cleaning up unused MCP containers...')

    try {
      // Get all TeamHub MCP containers
      const { stdout } = await execAsync(
        'docker ps -a --filter name=teamhub-mcp- --format "{{.Names}}"'
      )
      const allContainers = stdout
        .trim()
        .split('\n')
        .filter((name) => name.trim())

      for (const containerName of allContainers) {
        const orgId = containerName.replace('teamhub-mcp-', '')

        if (!activeOrganizations.includes(orgId)) {
          console.log(`Removing unused container for organization: ${orgId}`)
          await this.removeContainer(orgId)
        }
      }

      console.log('✅ Cleanup completed')
    } catch (error) {
      console.error('❌ Error during cleanup:', error)
    }
  }
}
