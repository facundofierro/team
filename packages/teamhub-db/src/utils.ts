export const tryAllSettled = async <T>(
  promises: Promise<T>[]
): Promise<T[]> => {
  const results = await Promise.allSettled(promises)

  const successfulResults: T[] = []

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      successfulResults.push(result.value)
    } else {
      console.error('Error:', result.reason)
    }
  })

  return successfulResults
}
