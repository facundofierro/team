import { useState, useEffect, useRef } from 'react'
import { Message } from '@ai-sdk/react'
import { useToast } from '@/hooks/use-toast'
import { parseToolError } from '../toolUtils'
import type { ToolCall } from '@teamhub/db'

interface UseToolCallProcessorProps {
  data: any[] // Streaming data from useChat
  currentConversation: any
  addMessageToConversation: (
    role: string,
    content: string,
    id: string,
    toolCalls?: ToolCall[]
  ) => Promise<void>
  setIsActiveChatting: (value: boolean) => void
  localConversation: any
  setLocalConversation: (value: any) => void
  messages: Message[]
}

export function useToolCallProcessor({
  data,
  currentConversation,
  addMessageToConversation,
  setIsActiveChatting,
  localConversation,
  setLocalConversation,
  messages,
}: UseToolCallProcessorProps) {
  const { toast } = useToast()

  // State for tracking processed tool call IDs to prevent duplicates
  const [processedToolCallIds, setProcessedToolCallIds] = useState<Set<string>>(
    new Set()
  )

  // Separate state for tool call messages that persist independently
  const [toolCallMessages, setToolCallMessages] = useState<
    (Message & { toolCall?: ToolCall })[]
  >([])

  // State to track tool calls that should be associated with the next assistant message
  const [pendingToolCalls, setPendingToolCalls] = useState<ToolCall[]>([])

  // Ref to ensure onFinish always sees current tool calls (avoid stale closure)
  const pendingToolCallsRef = useRef<ToolCall[]>([])

  // Create onFinish handler for useChat
  const createOnFinishHandler = () => async (message: Message) => {
    // Clear the active chatting flag since the conversation turn is complete
    setIsActiveChatting(false)

    // Update local conversation message count immediately
    if (localConversation) {
      setLocalConversation({
        ...localConversation,
        messageCount: messages.length + 1, // +1 for the AI response that just finished
      })
    }

    // Add AI response to database conversation with any associated tool calls
    if (currentConversation) {
      // Use ref to get current tool calls (avoiding stale closure)
      const currentToolCalls = pendingToolCallsRef.current
      const toolCallsToStore =
        currentToolCalls.length > 0 ? currentToolCalls : undefined

      await addMessageToConversation(
        'assistant',
        message.content,
        message.id,
        toolCallsToStore
      )

      // Clear pending tool calls after storing them
      setPendingToolCalls([])
      pendingToolCallsRef.current = []
    } else {
      console.warn('⚠️ No current conversation to add AI response to')
    }
  }

  // Create onError handler for useChat
  const createOnErrorHandler = () => (error: Error) => {
    console.error('💥 Chat error:', error)

    // Clear the active chatting flag on error
    setIsActiveChatting(false)

    // Parse the error and show appropriate toast
    let title = 'Chat Error'
    let description =
      'An error occurred while processing your message. Please try again.'

    const errorMessage = error.message || error.toString()

    if (
      errorMessage.includes('AI_ToolExecutionError') ||
      errorMessage.includes('Error executing tool')
    ) {
      // Extract tool name if possible
      const toolNameMatch =
        errorMessage.match(/tool (\w+):/i) ||
        errorMessage.match(
          /Error executing tool \w+-\w+-\w+-\w+-\w+: Failed to (\w+)/i
        )

      const toolName =
        toolNameMatch && toolNameMatch[1] === 'searchYandex'
          ? 'Yandex Search'
          : toolNameMatch
          ? toolNameMatch[1]
          : 'Unknown Tool'

      if (
        errorMessage.includes('token has expired') ||
        errorMessage.includes('401 Unauthorized')
      ) {
        title = `${toolName} - Authentication Error`
        description =
          'The API token has expired and needs to be refreshed. Please contact your administrator.'
      } else if (
        errorMessage.includes('rate limit') ||
        errorMessage.includes('429')
      ) {
        title = `${toolName} - Rate Limit`
        description =
          'API rate limit exceeded. Please try again in a few minutes.'
      } else if (
        errorMessage.includes('network') ||
        errorMessage.includes('timeout')
      ) {
        title = `${toolName} - Network Error`
        description =
          'Network connection failed. Please check your internet connection and try again.'
      } else {
        title = `${toolName} - Error`
        description =
          'Tool execution failed. Please try again or contact support if the issue persists.'
      }
    } else if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch')
    ) {
      title = 'Network Error'
      description =
        'Unable to connect to the server. Please check your internet connection and try again.'
    } else if (errorMessage.includes('timeout')) {
      title = 'Request Timeout'
      description = 'The request took too long to complete. Please try again.'
    }

    toast({
      title,
      description,
      variant: 'destructive',
    })
  }

  // Process streaming data for tool calls
  useEffect(() => {
    if (data && Array.isArray(data)) {
      for (const item of data) {
        if (typeof item === 'object' && item !== null) {
          const dataItem = item as any

          if (dataItem.type === 'tool-call' && dataItem.toolCall) {
            const toolCallId = dataItem.toolCall.id

            // Skip if we've already processed this tool call
            if (processedToolCallIds.has(toolCallId)) {
              continue
            }

            // Check if this is an error tool call and show toast
            if (dataItem.toolCall.status === 'error') {
              const errorInfo = parseToolError(dataItem.toolCall)
              toast({
                title: errorInfo.title,
                description: errorInfo.description,
                variant: errorInfo.variant,
              })
            }

            // Create a new tool call message with the tool call data
            // Use a timestamp that ensures it appears before the assistant response
            const toolCallMessage: Message & { toolCall?: ToolCall } = {
              id: `tool-${toolCallId}`,
              role: 'system' as const,
              content: `Tool execution: ${dataItem.toolCall.name}`,
              createdAt: new Date(Date.now() - 1000), // 1 second earlier to ensure proper ordering
              toolCall: dataItem.toolCall,
            }

            // Add the tool call message to our separate tool call messages state
            setToolCallMessages((prevToolMessages) => {
              // Check if this tool call message already exists
              const exists = prevToolMessages.some(
                (msg) => msg.id === toolCallMessage.id
              )
              if (exists) {
                return prevToolMessages
              }
              return [...prevToolMessages, toolCallMessage]
            })

            // Add tool call to pending list to be stored with the next assistant message
            setPendingToolCalls((prevPending) => {
              // Check if this tool call is already pending
              const exists = prevPending.some((tc) => tc.id === toolCallId)
              if (exists) {
                return prevPending
              }
              const newPending = [...prevPending, dataItem.toolCall]
              // Keep ref in sync with state
              pendingToolCallsRef.current = newPending
              return newPending
            })

            // Mark this tool call as processed
            setProcessedToolCallIds((prev) => new Set([...prev, toolCallId]))
          }

          // Handle tool execution errors that might come through different stream types
          if (dataItem.type === 'error' && dataItem.error) {
            // Check if this is a tool execution error
            if (
              dataItem.error.includes('AI_ToolExecutionError') ||
              dataItem.error.includes('Error executing tool') ||
              dataItem.error.includes('tool execution')
            ) {
              let toolName = 'Unknown Tool'
              let errorMessage = dataItem.error

              // Try to extract tool name and error details
              const toolNameMatch = dataItem.error.match(/tool (\w+):/i)
              if (toolNameMatch) {
                toolName =
                  toolNameMatch[1] === 'searchYandex'
                    ? 'Yandex Search'
                    : toolNameMatch[1]
              }

              // Parse specific error types from the error message
              let title = `${toolName} - Error`
              let description =
                'Tool execution failed. Please try again or contact support if the issue persists.'

              if (
                errorMessage.includes('token has expired') ||
                errorMessage.includes('401 Unauthorized')
              ) {
                title = `${toolName} - Authentication Error`
                description =
                  'The API token has expired and needs to be refreshed. Please contact your administrator.'
              } else if (
                errorMessage.includes('rate limit') ||
                errorMessage.includes('429')
              ) {
                title = `${toolName} - Rate Limit`
                description =
                  'API rate limit exceeded. Please try again in a few minutes.'
              } else if (
                errorMessage.includes('network') ||
                errorMessage.includes('timeout') ||
                errorMessage.includes('ECONNREFUSED')
              ) {
                title = `${toolName} - Network Error`
                description =
                  'Network connection failed. Please check your internet connection and try again.'
              } else if (
                errorMessage.includes('quota') ||
                errorMessage.includes('exceeded')
              ) {
                title = `${toolName} - Quota Exceeded`
                description =
                  'API quota has been exceeded. Please try again later or contact your administrator.'
              } else if (
                errorMessage.includes('403') ||
                errorMessage.includes('Forbidden') ||
                errorMessage.includes('permission')
              ) {
                title = `${toolName} - Permission Error`
                description =
                  'Insufficient permissions to access this resource. Please contact your administrator.'
              }

              toast({
                title,
                description,
                variant: 'destructive',
              })
            }
          }
        }
      }
    }
  }, [data, processedToolCallIds, toast])

  // Reset tool call state when starting a new conversation
  const resetToolCallState = () => {
    setProcessedToolCallIds(new Set())
    setToolCallMessages([])
    setPendingToolCalls([])
    pendingToolCallsRef.current = []
  }

  return {
    toolCallMessages,
    processedToolCallIds,
    pendingToolCalls,
    createOnFinishHandler,
    createOnErrorHandler,
    resetToolCallState,
  }
}
