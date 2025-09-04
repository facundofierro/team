import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('🧪 Test Stream: Starting simple stream test')

  // Create a simple streaming response
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      console.log('🧪 Test Stream: Stream started')

      // Send AI SDK compatible stream format
      const chunks = [
        '0:"Hello"\n',
        '0:" there"\n',
        '0:"! This"\n',
        '0:" is"\n',
        '0:" a"\n',
        '0:" test"\n',
        '0:" stream"\n',
        '0:"."\n',
      ]

      let index = 0
      const sendNext = () => {
        if (index < chunks.length) {
          console.log(
            `🧪 Test Stream: Sending chunk ${index}: ${chunks[index].trim()}`
          )
          controller.enqueue(encoder.encode(chunks[index]))
          index++
          setTimeout(sendNext, 300) // Send every 300ms
        } else {
          console.log('🧪 Test Stream: Stream complete')
          controller.close()
        }
      }

      sendNext()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
