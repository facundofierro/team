import { useState, useCallback, useEffect } from 'react'
import { useAgentStore } from '@/stores/agentStore'

interface LocalConversation {
  id: string
  title: string
  messageCount: number
  isActive: boolean
}

export function useChatState() {
  const [isInstancesOpen, setIsInstancesOpen] = useState(true)
  const [chatId, setChatId] = useState<string>(() => `chat_${Date.now()}`)
  const [isActiveChatting, setIsActiveChatting] = useState(false)
  const [localConversation, setLocalConversation] =
    useState<LocalConversation | null>(null)

  const selectedAgentId = useAgentStore((state) => state.selectedAgentId)
  const [previousAgentId, setPreviousAgentId] = useState<string | null>(null)

  const generateNewChatId = useCallback(() => {
    const newChatId = `chat_${Date.now()}`
    setChatId(newChatId)
    return newChatId
  }, [])

  const resetChatState = useCallback(() => {
    setIsActiveChatting(false)
    setLocalConversation(null)
    generateNewChatId()
  }, [generateNewChatId])

  // Reset chat state when agent changes (but not on initial load)
  useEffect(() => {
    if (selectedAgentId && previousAgentId && selectedAgentId !== previousAgentId) {
      console.log('💬 [useChatState] Agent changed, resetting chat state')
      resetChatState()
    }
    setPreviousAgentId(selectedAgentId)
  }, [selectedAgentId, previousAgentId, resetChatState])

  const toggleInstancesOpen = useCallback(() => {
    setIsInstancesOpen((prev) => !prev)
  }, [])

  return {
    isInstancesOpen,
    setIsInstancesOpen,
    toggleInstancesOpen,
    chatId,
    setChatId,
    generateNewChatId,
    isActiveChatting,
    setIsActiveChatting,
    localConversation,
    setLocalConversation,
    resetChatState,
  }
}
