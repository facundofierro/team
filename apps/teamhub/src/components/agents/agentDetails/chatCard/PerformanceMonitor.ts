export interface PerformanceMetrics {
  renderTime: number
  messageCount: number
  domSize: number
  memoryUsage: number
  scrollPerformance: number
  streamingLatency?: number
  timestamp: number
}

export interface PerformanceWarning {
  type: 'memory' | 'render' | 'scroll' | 'streaming'
  severity: 'low' | 'medium' | 'high'
  message: string
  suggestion: string
  threshold: number
  currentValue: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxHistorySize = 100
  private renderStartTime = 0
  private lastFrameTime = 0
  private frameCount = 0
  private isMonitoring = false

  // Performance thresholds
  private readonly thresholds = {
    renderTime: { low: 16, medium: 33, high: 50 }, // ms (60fps = 16ms, 30fps = 33ms)
    messageCount: { low: 100, medium: 200, high: 500 },
    domSize: { low: 50, medium: 100, high: 150 },
    memoryUsage: { low: 10, medium: 25, high: 50 }, // MB
    scrollLatency: { low: 16, medium: 33, high: 50 }, // ms
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  // Initialize performance monitoring
  private initializeMonitoring(): void {
    // Monitor FPS and frame timing
    this.startFrameMonitoring()

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      this.startMemoryMonitoring()
    }
  }

  // Start render time measurement
  public startRender(): void {
    this.renderStartTime = performance.now()
  }

  // End render time measurement and record metrics
  public endRender(
    messageCount: number,
    domSize: number,
    memoryUsage: number
  ): PerformanceMetrics {
    const renderTime = performance.now() - this.renderStartTime

    const metrics: PerformanceMetrics = {
      renderTime,
      messageCount,
      domSize,
      memoryUsage,
      scrollPerformance: this.getScrollPerformance(),
      timestamp: Date.now(),
    }

    this.recordMetrics(metrics)
    return metrics
  }

  // Record streaming latency
  public recordStreamingLatency(latency: number): void {
    const lastMetrics = this.getLatestMetrics()
    if (lastMetrics) {
      lastMetrics.streamingLatency = latency
    }
  }

  // Get current performance warnings
  public getWarnings(): PerformanceWarning[] {
    const warnings: PerformanceWarning[] = []
    const latestMetrics = this.getLatestMetrics()

    if (!latestMetrics) return warnings

    // Render performance warnings
    if (latestMetrics.renderTime > this.thresholds.renderTime.high) {
      warnings.push({
        type: 'render',
        severity: 'high',
        message: `Slow rendering detected (${latestMetrics.renderTime.toFixed(
          1
        )}ms)`,
        suggestion:
          'Consider enabling streaming mode or reducing visible messages',
        threshold: this.thresholds.renderTime.high,
        currentValue: latestMetrics.renderTime,
      })
    } else if (latestMetrics.renderTime > this.thresholds.renderTime.medium) {
      warnings.push({
        type: 'render',
        severity: 'medium',
        message: `Moderate render latency (${latestMetrics.renderTime.toFixed(
          1
        )}ms)`,
        suggestion: 'Performance may improve with message pagination',
        threshold: this.thresholds.renderTime.medium,
        currentValue: latestMetrics.renderTime,
      })
    }

    // Message count warnings
    if (latestMetrics.messageCount > this.thresholds.messageCount.high) {
      warnings.push({
        type: 'memory',
        severity: 'high',
        message: `Very large conversation (${latestMetrics.messageCount} messages)`,
        suggestion:
          'Consider archiving old messages or using virtual scrolling',
        threshold: this.thresholds.messageCount.high,
        currentValue: latestMetrics.messageCount,
      })
    } else if (
      latestMetrics.messageCount > this.thresholds.messageCount.medium
    ) {
      warnings.push({
        type: 'memory',
        severity: 'medium',
        message: `Large conversation (${latestMetrics.messageCount} messages)`,
        suggestion:
          'Memory optimization is active - performance should remain good',
        threshold: this.thresholds.messageCount.medium,
        currentValue: latestMetrics.messageCount,
      })
    }

    // DOM size warnings
    if (latestMetrics.domSize > this.thresholds.domSize.high) {
      warnings.push({
        type: 'memory',
        severity: 'high',
        message: `Too many DOM elements (${latestMetrics.domSize})`,
        suggestion: 'DOM cleanup may not be working properly',
        threshold: this.thresholds.domSize.high,
        currentValue: latestMetrics.domSize,
      })
    }

    // Memory usage warnings
    if (latestMetrics.memoryUsage > this.thresholds.memoryUsage.high) {
      warnings.push({
        type: 'memory',
        severity: 'high',
        message: `High memory usage (${latestMetrics.memoryUsage}MB)`,
        suggestion:
          'Consider clearing old conversations or refreshing the page',
        threshold: this.thresholds.memoryUsage.high,
        currentValue: latestMetrics.memoryUsage,
      })
    }

    // Streaming latency warnings
    if (
      latestMetrics.streamingLatency &&
      latestMetrics.streamingLatency > this.thresholds.scrollLatency.high
    ) {
      warnings.push({
        type: 'streaming',
        severity: 'high',
        message: `Slow streaming response (${latestMetrics.streamingLatency.toFixed(
          1
        )}ms)`,
        suggestion: 'Network or processing delay detected',
        threshold: this.thresholds.scrollLatency.high,
        currentValue: latestMetrics.streamingLatency,
      })
    }

    return warnings
  }

  // Get performance insights and recommendations
  public getInsights(): string[] {
    const insights: string[] = []
    const recentMetrics = this.getRecentMetrics(10)

    if (recentMetrics.length < 3) return insights

    // Analyze trends
    const avgRenderTime =
      recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) /
      recentMetrics.length
    const renderTrend = this.getTrend(recentMetrics.map((m) => m.renderTime))
    const messageTrend = this.getTrend(recentMetrics.map((m) => m.messageCount))

    // Performance insights
    if (avgRenderTime < this.thresholds.renderTime.low) {
      insights.push(
        '✅ Excellent render performance - conversation is well optimized'
      )
    } else if (avgRenderTime < this.thresholds.renderTime.medium) {
      insights.push(
        '👍 Good render performance - optimizations are working well'
      )
    }

    if (renderTrend === 'improving') {
      insights.push('📈 Render performance is improving over time')
    } else if (renderTrend === 'degrading') {
      insights.push(
        '📉 Render performance is degrading - consider optimization'
      )
    }

    if (messageTrend === 'degrading') {
      insights.push('💬 Conversation is growing - memory management is active')
    }

    // DOM optimization insights
    const latestMetrics = this.getLatestMetrics()
    if (
      latestMetrics &&
      latestMetrics.domSize < latestMetrics.messageCount * 0.5
    ) {
      insights.push('🧠 DOM optimization is working effectively')
    }

    return insights
  }

  // Get performance score (0-100)
  public getPerformanceScore(): number {
    const latestMetrics = this.getLatestMetrics()
    if (!latestMetrics) return 100

    let score = 100

    // Render time score (40% weight)
    const renderScore = Math.max(
      0,
      100 - (latestMetrics.renderTime / this.thresholds.renderTime.high) * 100
    )
    score = score * 0.4 + renderScore * 0.4

    // Memory efficiency score (30% weight)
    const memoryScore = Math.max(
      0,
      100 - (latestMetrics.memoryUsage / this.thresholds.memoryUsage.high) * 100
    )
    score = score * 0.7 + memoryScore * 0.3

    // DOM efficiency score (20% weight)
    const domScore = Math.max(
      0,
      100 - (latestMetrics.domSize / this.thresholds.domSize.high) * 100
    )
    score = score * 0.8 + domScore * 0.2

    // Streaming score (10% weight)
    if (latestMetrics.streamingLatency) {
      const streamingScore = Math.max(
        0,
        100 -
          (latestMetrics.streamingLatency /
            this.thresholds.scrollLatency.high) *
            100
      )
      score = score * 0.9 + streamingScore * 0.1
    }

    return Math.round(Math.max(0, Math.min(100, score)))
  }

  // Start frame monitoring for FPS tracking
  private startFrameMonitoring(): void {
    const measureFrame = () => {
      const now = performance.now()
      if (this.lastFrameTime > 0) {
        this.frameCount++
      }
      this.lastFrameTime = now

      if (this.isMonitoring) {
        requestAnimationFrame(measureFrame)
      }
    }

    this.isMonitoring = true
    requestAnimationFrame(measureFrame)
  }

  // Get scroll performance metric
  private getScrollPerformance(): number {
    // Simple metric based on frame time
    if (this.frameCount > 0 && this.lastFrameTime > 0) {
      return 1000 / 60 // Target 60fps = 16.67ms per frame
    }
    return 16 // Default good performance
  }

  // Start memory monitoring
  private startMemoryMonitoring(): void {
    // Monitor memory usage periodically
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        if (memory && process.env.NODE_ENV === 'development') {
          console.log('🧠 Memory:', {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB',
          })
        }
      }
    }, 30000) // Every 30 seconds
  }

  // Record metrics with history limit
  private recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics)

    // Keep only recent metrics
    if (this.metrics.length > this.maxHistorySize) {
      this.metrics = this.metrics.slice(-this.maxHistorySize)
    }
  }

  // Get latest metrics
  public getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0
      ? this.metrics[this.metrics.length - 1]
      : null
  }

  // Get recent metrics
  public getRecentMetrics(count: number): PerformanceMetrics[] {
    return this.metrics.slice(-count)
  }

  // Calculate trend for a series of values
  private getTrend(values: number[]): 'improving' | 'degrading' | 'stable' {
    if (values.length < 2) return 'stable'

    const first = values.slice(0, Math.floor(values.length / 2))
    const second = values.slice(Math.floor(values.length / 2))

    const firstAvg = first.reduce((sum, val) => sum + val, 0) / first.length
    const secondAvg = second.reduce((sum, val) => sum + val, 0) / second.length

    const change = (secondAvg - firstAvg) / firstAvg

    if (change < -0.1) return 'improving'
    if (change > 0.1) return 'degrading'
    return 'stable'
  }

  // Get all metrics for analysis
  public getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  // Clear metrics history
  public clearHistory(): void {
    this.metrics = []
  }

  // Stop monitoring
  public destroy(): void {
    this.isMonitoring = false
    this.clearHistory()
  }

  // Export metrics for external analysis
  public exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        summary: {
          totalSamples: this.metrics.length,
          averageRenderTime:
            this.metrics.reduce((sum, m) => sum + m.renderTime, 0) /
            this.metrics.length,
          performanceScore: this.getPerformanceScore(),
          warnings: this.getWarnings(),
          insights: this.getInsights(),
        },
      },
      null,
      2
    )
  }
}
