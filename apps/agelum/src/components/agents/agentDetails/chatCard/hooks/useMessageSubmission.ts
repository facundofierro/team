import { useCallback } from 'react'
import { Message } from '@ai-sdk/react'

interface UseMessageSubmissionProps {
  isLoading: boolean
  input: string
  currentConversation: any
  localConversation: any
  selectedAgent: any
  startNewConversation: (userMessage: string) => Promise<any>
  addMessageToConversation: (
    role: string,
    content: string,
    id: string,
    toolCalls?: any
  ) => Promise<void>
  setIsActiveChatting: (value: boolean) => void
  setLocalConversation: (value: any) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function useMessageSubmission({
  isLoading,
  input,
  currentConversation,
  localConversation,
  selectedAgent,
  startNewConversation,
  addMessageToConversation,
  setIsActiveChatting,
  setLocalConversation,
  handleSubmit,
}: UseMessageSubmissionProps) {
  // Enhanced submit handler to create conversation on first message
  const handleEnhancedSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!input.trim() || isLoading) return

      const userMessage = input.trim()

      // Mark that we're starting an active chat session
      setIsActiveChatting(true)

      // If no current conversation exists, create database conversation FIRST
      if (!currentConversation && !localConversation && selectedAgent?.id) {
        // Create immediate local conversation state for UI feedback
        const tempConversation = {
          id: `temp_${Date.now()}`,
          title:
            userMessage.length > 50
              ? userMessage.substring(0, 47) + '...'
              : userMessage,
          messageCount: 1, // Will be 1 after user message is added
          isActive: true,
        }
        setLocalConversation(tempConversation)

        try {
          // Create database conversation and wait for it to complete
          const newConversation = await startNewConversation(userMessage)
          if (newConversation) {
            // Add the user message to the newly created conversation
            await addMessageToConversation(
              'user',
              userMessage,
              `msg_user_${Date.now()}`, // Generate user message ID
              undefined
            )
          } else {
            console.error('❌ Failed to create new conversation')
          }
        } catch (error) {
          console.error('Failed to start new conversation:', error)
          // Continue with regular submit even if conversation creation fails
        }
      } else if (currentConversation) {
        // Add user message to existing conversation
        await addMessageToConversation(
          'user',
          userMessage,
          `msg_user_${Date.now()}`, // Generate user message ID
          undefined
        )
        // Update local conversation message count immediately
        if (localConversation) {
          setLocalConversation({
            ...localConversation,
            messageCount: localConversation.messageCount + 1,
          })
        }
      } else if (localConversation) {
        // Update local conversation message count for subsequent messages
        setLocalConversation({
          ...localConversation,
          messageCount: localConversation.messageCount + 1,
        })
      }

      // Proceed with normal chat submission
      handleSubmit(e)
    },
    [
      input,
      isLoading,
      currentConversation,
      localConversation,
      selectedAgent?.id,
      startNewConversation,
      addMessageToConversation,
      setIsActiveChatting,
      setLocalConversation,
      handleSubmit,
    ]
  )

  return {
    handleEnhancedSubmit,
  }
}
