import {
  getCron,
  getMessage,
  updateMessage,
  updateCronLastRun,
  reactiveDb,
} from '@teamhub/db'

export async function cronExecute(cronId: string) {
  const cronJob = await getCron.execute({ id: cronId }, reactiveDb)
  if (!cronJob) throw new Error('Cron job not found')

  if (!cronJob.messageId) throw new Error('Message ID is required')
  const message = await getMessage.execute(
    { id: cronJob.messageId },
    reactiveDb
  )
  if (!message) throw new Error('Message not found')

  // TODO: Implement task execution logic
  await updateMessage.execute(
    { id: message.id, data: { status: 'completed' } },
    reactiveDb
  )
  await updateCronLastRun.execute({ id: cronId }, reactiveDb)

  return message
}
