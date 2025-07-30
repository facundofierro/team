import { useState, useCallback } from 'react'

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
