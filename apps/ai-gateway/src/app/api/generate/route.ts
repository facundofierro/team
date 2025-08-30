import { NextRequest, NextResponse } from 'next/server'
import { generate } from '@team/ai-services'
import { log } from '@repo/logger'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (token !== process.env.AI_GATEWAY_API_KEY) {
      log.aiGateway.request.warn(
        'Unauthorized API request attempt',
        undefined,
        {
          ip:
            req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        }
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      provider,
      model,
      feature,
      subfeature,
      featureOptions,
      input,
      gateway,
    } = body

    log.aiGateway.request.info('AI generation request received', undefined, {
      provider,
      model,
      feature,
      subfeature,
      featureOptions: featureOptions ? 'present' : 'none',
      hasInput: !!input,
      gateway,
    })

    // Call the generate function
    const result = await generate({
      provider,
      model,
      feature,
      subfeature,
      gateway: provider,
      featureOptions,
      input,
    })

    log.aiGateway.provider.info(
      'AI generation completed successfully',
      undefined,
      {
        provider,
        model,
        feature,
        subfeature,
        resultType: result instanceof ReadableStream ? 'stream' : typeof result,
      }
    )

    // Handle streaming (assume result is a ReadableStream if streaming)
    if (featureOptions?.streaming && result instanceof ReadableStream) {
      return new NextResponse(result, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      })
    }

    // Handle embeddings (JSON array)
    if (feature === 'text' && subfeature === 'embeddings') {
      return NextResponse.json(result)
    }

    // Handle images (Buffer or base64)
    if (feature === 'image' && subfeature === 'generation' && result?.image) {
      if (
        typeof result.image === 'object' &&
        result.image instanceof Uint8Array
      ) {
        return new NextResponse(result.image, {
          status: 200,
          headers: { 'Content-Type': 'image/png' },
        })
      } else if (typeof result.image === 'string') {
        // Assume base64
        const buffer = Uint8Array.from(Buffer.from(result.image, 'base64'))
        return new NextResponse(buffer, {
          status: 200,
          headers: { 'Content-Type': 'image/png' },
        })
      }
    }

    // Handle video (Buffer or base64)
    if (
      feature === 'video' &&
      subfeature === 'generation_async' &&
      result?.video
    ) {
      if (
        typeof result.video === 'object' &&
        result.video instanceof Uint8Array
      ) {
        return new NextResponse(result.video, {
          status: 200,
          headers: { 'Content-Type': 'video/mp4' },
        })
      } else if (typeof result.video === 'string') {
        const buffer = Uint8Array.from(Buffer.from(result.video, 'base64'))
        return new NextResponse(buffer, {
          status: 200,
          headers: { 'Content-Type': 'video/mp4' },
        })
      }
    }

    // Handle JSON response
    if (featureOptions?.json || typeof result === 'object') {
      return NextResponse.json(result)
    }

    // Default: treat as text
    return new NextResponse(result, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
