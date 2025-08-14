import {
  db,
  getCron,
  getMessage,
  updateMessage,
  updateCronLastRun,
  reactiveDb,
} from '@teamhub/db'

export async function cronExecute(cronId: string) {
  const cronJob = await db.getCron(cronId)
  if (!cronJob) throw new Error('Cron job not found')

  if (!cronJob.messageId) throw new Error('Message ID is required')
  const message = await db.getMessage(cronJob.messageId)
  if (!message) throw new Error('Message not found')

  // TODO: Implement task execution logic
  await db.updateMessage(message.id, { status: 'completed' })
  await db.updateCronLastRun(cronId)

  return message
}
