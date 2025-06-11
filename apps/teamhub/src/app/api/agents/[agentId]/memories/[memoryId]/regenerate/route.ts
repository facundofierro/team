import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db, dbMemories } from '@teamhub/db'
import {
  generateConversationTitle,
  generateConversationBrief,
  generateDescriptionFromSummary,
  generateTitleFromDescription,
  type ConversationProcessingOptions,
} from '@teamhub/ai'
import type { ConversationMessage } from '@teamhub/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string; memoryId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agentId, memoryId } = await params
    const { organizationId } = await request.json()

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Get organization details
    const organizations = await db.getOrganizations(session.user.id)
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const memoryFunctions = await dbMemories(organization.databaseName)

    // Get the existing memory
    const memory = await memoryFunctions.getMemory(memoryId)
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    // Only regenerate for conversation type memories
    if (memory.type !== 'conversation') {
      return NextResponse.json(
        { error: 'Can only regenerate conversation memories' },
        { status: 400 }
      )
    }

    // Check if memory has content (messages)
    if (!Array.isArray(memory.content) || memory.content.length === 0) {
      return NextResponse.json(
        { error: 'Memory has no conversation content to regenerate from' },
        { status: 400 }
      )
    }

    const messages = memory.content as ConversationMessage[]

    console.log('🔄 Regenerating memory content for:', memoryId)
    console.log('📋 Message count:', messages.length)

    // Processing options
    const processingOptions: ConversationProcessingOptions = {
      orgDatabaseName: organization.databaseName,
      aiProvider: 'deepseek',
      skipEmbeddings: true,
    }

    const conversationMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Step 1: Generate summary first (most detailed, from full conversation)
    console.log('📋 Step 1: Generating valuable content summary...')
    const briefData = await generateConversationBrief(
      conversationMessages,
      processingOptions.aiProvider
    )

    // Step 2: Generate description from the summary (overview of what's in summary)
    console.log('🔍 Step 2: Generating description from summary...')
    const descriptionFromSummary = await generateDescriptionFromSummary(
      briefData.summary,
      processingOptions.aiProvider
    )

    // Step 3: Generate title from the description (most concise)
    console.log('🎯 Step 3: Generating title from description...')
    const newTitle = await generateTitleFromDescription(
      descriptionFromSummary,
      processingOptions.aiProvider
    )

    // Use the generated description instead of the one from briefData
    const finalBriefData = {
      ...briefData,
      description: descriptionFromSummary,
    }

    // Update the memory with regenerated content
    console.log('💾 Updating memory with new content...')
    await memoryFunctions.updateMemory(memoryId, {
      title: newTitle,
      description: finalBriefData.description,
      summary: finalBriefData.summary,
      keyTopics: finalBriefData.keyTopics,
      updatedAt: new Date(),
    })

    console.log('✅ Memory regeneration completed successfully')

    // Return the updated memory
    const updatedMemory = await memoryFunctions.getMemory(memoryId)

    return NextResponse.json({
      success: true,
      memory: updatedMemory,
      changes: {
        title: { old: memory.title, new: newTitle },
        description: {
          old: memory.description,
          new: finalBriefData.description,
        },
        summary: { old: memory.summary, new: finalBriefData.summary },
        keyTopics: { old: memory.keyTopics, new: finalBriefData.keyTopics },
      },
    })
  } catch (error) {
    console.error('❌ Failed to regenerate memory content:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate memory content' },
      { status: 500 }
    )
  }
}
