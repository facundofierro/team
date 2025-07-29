# A2A Communication - Practical Examples

## Quick Start Examples

Here are practical examples of how agents can use the A2A communication tool:

## Example 1: Customer Support Escalation Workflow

```typescript
// Customer Support Agent receives a complex technical issue
// and escalates to Technical Specialist

await useAgentToAgent({
  targetAgentId: 'agent-tech-specialist-001',
  messageType: 'task',
  content: `Complex database performance issue reported by customer ID: CUST-2024-001.

Customer reports:
- Query timeouts on user dashboard (>30 seconds)
- Data inconsistencies in reporting module
- Last occurred: 2024-01-15 14:30 UTC

Customer tier: Enterprise (high priority)
SLA: 4-hour response time

Please investigate and provide:
1. Root cause analysis
2. Immediate workaround if available
3. Permanent fix timeline
4. Customer communication draft

Customer contact: tech@enterprise-client.com`,
  priority: 'high',
  metadata: {
    taskId: 'support-escalation-db-perf-001',
    tags: ['customer-support', 'database', 'performance', 'enterprise'],
    originalConversationId: 'conv_customer_support_chat_001',
    expiresAt: '2024-01-15T18:30:00Z', // 4-hour SLA
  },
})
```

## Example 2: Data Pipeline Orchestration

```typescript
// Data Ingestion Agent completes data collection
// and triggers the processing pipeline

await useAgentToAgent({
  targetAgentId: 'agent-data-processor-001',
  messageType: 'workflow',
  content: `Daily data ingestion completed successfully.

Dataset details:
- Records processed: 45,230
- Source: customer_interactions_api
- Time range: 2024-01-15 00:00 - 23:59 UTC
- Data quality score: 97.3%
- Failed records: 1,234 (logged in error bucket)

Next steps:
1. Data validation and cleaning
2. Apply business rules transformation
3. Generate quality report
4. Forward to analytics team

Data location: s3://teamhub-data/daily/2024-01-15/
Schema version: v2.4.1`,
  priority: 'normal',
  metadata: {
    workflowId: 'daily-data-pipeline-2024-01-15',
    taskId: 'data-processing-step',
    tags: ['data-pipeline', 'etl', 'daily-batch'],
    attachments: [
      {
        type: 'dataset_metadata',
        data: {
          bucket: 'teamhub-data',
          path: 'daily/2024-01-15/',
          recordCount: 45230,
          schemaVersion: 'v2.4.1',
          qualityScore: 97.3,
        },
      },
    ],
  },
})
```

## Example 3: Report Generation Request

```typescript
// Project Manager requests weekly status report
// from Analytics Agent

await useAgentToAgent({
  targetAgentId: 'agent-analytics-specialist',
  messageType: 'request',
  content: `Please generate the weekly project status report for the Q1 customer onboarding initiative.

Report should include:
1. Key metrics: conversion rates, time-to-onboard, user activation
2. Progress against OKRs (Q1 targets)
3. Blockers and risks identification
4. Resource utilization analysis
5. Next week priorities

Target audience: Executive team
Delivery format: PDF + slide deck
Required by: Thursday 2 PM for executive review

Historical comparison: Compare with previous 4 weeks
Focus areas: Highlight conversion rate improvements and bottlenecks`,
  priority: 'normal',
  metadata: {
    taskId: 'weekly-report-q1-onboarding-w3',
    tags: ['reporting', 'analytics', 'weekly', 'executive'],
    expiresAt: '2024-01-18T14:00:00Z',
  },
})
```

## Example 4: Scheduled Maintenance Notification

```typescript
// System Admin schedules maintenance notification
// to be sent to Monitoring Agent

await useAgentToAgent({
  targetAgentId: 'agent-system-monitor',
  messageType: 'notification',
  content: `Scheduled database maintenance window approaching.

Maintenance details:
- Date: 2024-01-20 02:00-04:00 UTC (Saturday)
- Systems affected: Primary customer database, reporting services
- Expected downtime: 90 minutes maximum
- Rollback plan: Available if issues arise

Pre-maintenance checklist:
✅ Backup verification completed
✅ Change management approval received
✅ Customer notifications sent
✅ Support team briefed

Monitor for:
- Database cluster health
- Application connectivity
- User session handling
- Background job queues

Emergency contact: ops-team@teamhub.com`,
  priority: 'high',
  metadata: {
    scheduledFor: '2024-01-19T20:00:00Z', // 6 hours before maintenance
    tags: ['maintenance', 'database', 'scheduled'],
    taskId: 'maintenance-notification-db-jan20',
  },
})
```

## Example 5: Code Review Request

```typescript
// Backend Developer requests code review
// from Senior Developer

await useAgentToAgent({
  targetAgentId: 'agent-senior-developer-001',
  messageType: 'request',
  content: `Code review requested for user authentication refactoring.

Changes summary:
- Migrated from JWT to OAuth 2.0 + PKCE
- Added rate limiting for login attempts
- Implemented session management improvements
- Updated password policy enforcement

Files changed: 12 files, +324 -156 lines
Branch: feature/auth-oauth-migration
PR: #1247

Focus areas for review:
1. Security implications of OAuth implementation
2. Performance impact of new session handling
3. Backward compatibility considerations
4. Error handling completeness

Testing completed:
✅ Unit tests (98% coverage)
✅ Integration tests
✅ Security scan (no high/critical issues)
✅ Performance benchmarks

Timeline: Targeting release in Sprint 23 (next week)`,
  priority: 'normal',
  metadata: {
    taskId: 'code-review-auth-oauth-pr1247',
    tags: ['code-review', 'authentication', 'security', 'oauth'],
    attachments: [
      {
        type: 'pull_request',
        data: {
          number: 1247,
          branch: 'feature/auth-oauth-migration',
          filesChanged: 12,
          linesAdded: 324,
          linesRemoved: 156,
        },
      },
    ],
  },
})
```

## Example 6: Response with Results

```typescript
// Analytics Specialist responds to report request
// with completed analysis

await useAgentToAgent({
  targetAgentId: 'agent-project-manager-001',
  messageType: 'response',
  content: `Weekly Q1 onboarding report completed and ready for executive review.

Key findings:
📈 Conversion rate: 34.2% (↑8.5% vs last week)
⏱️ Average time-to-onboard: 3.2 days (↓0.8 days)
🎯 User activation: 78% within 7 days (↑12%)

OKR progress:
✅ Q1 Target 1: 35% conversion rate (98% achieved)
🟡 Q1 Target 2: 80% activation rate (98% achieved)
✅ Q1 Target 3: <3 day onboarding (107% achieved)

🚫 Critical blocker identified:
Payment processing delays causing 23% drop-off at checkout.
Recommended action: Immediate payment team escalation.

📊 Reports generated:
- Executive summary: onboarding-exec-summary-w3.pdf
- Detailed analysis: onboarding-detailed-w3.pdf
- Slide deck: onboarding-presentation-w3.pptx

All files uploaded to: /reports/q1-onboarding/week3/`,
  priority: 'normal',
  metadata: {
    responseToMessageId: 'a2a_1640995200_report_request_123',
    originalConversationId: 'conv_weekly_reporting_session',
    tags: ['report-delivery', 'analytics', 'completed'],
    attachments: [
      {
        type: 'report_bundle',
        data: {
          files: [
            'onboarding-exec-summary-w3.pdf',
            'onboarding-detailed-w3.pdf',
            'onboarding-presentation-w3.pptx',
          ],
          location: '/reports/q1-onboarding/week3/',
          generatedAt: '2024-01-17T10:30:00Z',
        },
      },
    ],
  },
})
```

## Example 7: Multi-Agent Workflow Chain

```typescript
// Marketing Agent initiates campaign analysis workflow

// Step 1: Request data preparation
await useAgentToAgent({
  targetAgentId: 'agent-data-analyst',
  messageType: 'workflow',
  content: `Campaign performance analysis needed for Q4 email campaigns.

Prepare dataset with:
- Email metrics: open rates, click rates, conversions
- Audience segments: demographics, behavior, engagement
- Campaign attributes: subject lines, send times, content type
- Revenue attribution: direct sales, assisted conversions

Time period: Q4 2023 (Oct 1 - Dec 31)
Campaigns: All email campaigns (exclude transactional)`,
  priority: 'normal',
  metadata: {
    workflowId: 'q4-campaign-analysis-2024',
    taskId: 'data-preparation',
    tags: ['marketing', 'campaign-analysis', 'workflow-start'],
  },
})

// Data Analyst completes prep and triggers ML analysis
await useAgentToAgent({
  targetAgentId: 'agent-ml-specialist',
  messageType: 'workflow',
  content: `Q4 campaign dataset prepared and ready for ML analysis.

Dataset summary:
- 847 campaigns analyzed
- 2.3M recipient records
- 15 performance metrics
- 8 audience segments

Analysis needed:
1. Segment performance patterns
2. Subject line effectiveness prediction
3. Optimal send time recommendations
4. Content type performance modeling

Dataset location: /data/campaigns/q4-2023-prepared/
Schema: campaign_analysis_v1.json`,
  priority: 'normal',
  metadata: {
    workflowId: 'q4-campaign-analysis-2024',
    taskId: 'ml-analysis',
    responseToMessageId: 'a2a_data_prep_request_456',
    tags: ['ml-analysis', 'campaign-data', 'workflow-continue'],
  },
})

// ML Specialist completes analysis and sends to Marketing
await useAgentToAgent({
  targetAgentId: 'agent-marketing-manager',
  messageType: 'workflow',
  content: `ML analysis complete. Key insights and recommendations ready.

🎯 Top findings:
1. Personalized subject lines: +23% open rate
2. Tuesday 10AM sends: +31% engagement
3. Video content: +45% click-through vs images
4. Segment "engaged_professionals": highest ROI (4.2x)

📈 Models trained:
- Subject line effectiveness: 87% accuracy
- Send time optimization: 92% accuracy
- Content recommendation: 89% accuracy

🔮 Predictions for Q1 2024:
- Implement recommendations → +28% campaign ROI
- Focus on top 3 segments → +41% efficiency

Full analysis: /reports/q4-campaign-ml-analysis/
Model artifacts: /models/campaign-optimization-v2/`,
  priority: 'normal',
  metadata: {
    workflowId: 'q4-campaign-analysis-2024',
    taskId: 'workflow-completion',
    responseToMessageId: 'a2a_ml_analysis_request_789',
    tags: ['ml-results', 'campaign-insights', 'workflow-end'],
    attachments: [
      {
        type: 'ml_insights',
        data: {
          modelAccuracy: {
            subjectLine: 0.87,
            sendTime: 0.92,
            contentRec: 0.89,
          },
          projectedImpact: {
            roiIncrease: 0.28,
            efficiencyGain: 0.41,
          },
        },
      },
    ],
  },
})
```

## Integration Patterns

### Pattern 1: Request-Response with Timeout

```typescript
// Implement timeout handling for requests
const response = await useAgentToAgent({
  targetAgentId: 'agent-external-api',
  messageType: 'request',
  content: 'Fetch latest stock prices for portfolio analysis',
  priority: 'normal',
  metadata: {
    expiresAt: new Date(Date.now() + 30000).toISOString(), // 30 second timeout
    tags: ['api-request', 'stocks', 'timeout-sensitive'],
  },
})

if (response.deliveryStatus === 'failed') {
  // Handle timeout or delivery failure
  console.log('Request failed:', response.message)
}
```

### Pattern 2: Parallel Task Distribution

```typescript
// Distribute analysis tasks to multiple agents
const analysisAgents = [
  'agent-financial-analyst',
  'agent-market-analyst',
  'agent-technical-analyst',
]

const analysisRequests = analysisAgents.map((agentId) =>
  useAgentToAgent({
    targetAgentId: agentId,
    messageType: 'task',
    content: `Analyze AAPL stock performance for Q4 2023 earnings report`,
    priority: 'normal',
    metadata: {
      workflowId: 'aapl-analysis-q4-2023',
      taskId: `analysis-${agentId}`,
      tags: ['parallel-analysis', 'earnings', 'aapl'],
    },
  })
)

// Wait for all analyses to be dispatched
const results = await Promise.all(analysisRequests)
console.log(`Dispatched ${results.length} analysis tasks`)
```

### Pattern 3: Conditional Workflow

```typescript
// Agent makes decisions based on data and routes accordingly
const analysisResult = await performDataAnalysis()

if (analysisResult.anomaliesDetected) {
  // Route to security team for investigation
  await useAgentToAgent({
    targetAgentId: 'agent-security-analyst',
    messageType: 'task',
    content: `Data anomalies detected requiring security review: ${analysisResult.summary}`,
    priority: 'urgent',
    metadata: {
      taskId: 'security-anomaly-investigation',
      tags: ['security', 'anomaly', 'urgent-review'],
    },
  })
} else {
  // Route to business team for normal processing
  await useAgentToAgent({
    targetAgentId: 'agent-business-analyst',
    messageType: 'workflow',
    content: `Data analysis complete. Normal patterns detected. Ready for business insights.`,
    priority: 'normal',
    metadata: {
      workflowId: 'normal-business-analysis',
      tags: ['business-analysis', 'normal-flow'],
    },
  })
}
```

These examples demonstrate the versatility and power of the A2A communication system, enabling complex multi-agent workflows while maintaining clear communication patterns and audit trails.
