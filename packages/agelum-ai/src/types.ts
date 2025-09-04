export type MemoryStoreRule = {
  messageType: string
  shouldStore: boolean
  retentionDays?: number
  category?: string
}

export type CronConfig = {
  schedule: string
  startDate?: Date
  endDate?: Date
}

export type TaskMetadata = {
  [key: string]: unknown
}
