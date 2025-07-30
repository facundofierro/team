'use client'

import { useState } from 'react'
import { Check, ChevronDown, Zap, Clock, DollarSign } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

// Types based on your ai-services model registry
interface ModelInfo {
  id: string
  displayName: string
  provider: string
  model: string
  features: string[]
  pricing?: {
    price: string
    price_unit_type: string
    price_unit_quantity: number
  }
  capabilities?: {
    contextLength: number
    supportsTools: boolean
    supportsStreaming: boolean
  }
  metadata?: {
    description?: string
    specialization?: string[]
    averageResponseTime?: number
  }
}

interface ModelSelectorProps {
  selectedModel?: ModelInfo
  availableModels: ModelInfo[]
  onModelChange: (model: ModelInfo) => void
  isLoading?: boolean
  className?: string
}

function getProviderColor(provider: string): string {
  const colors = {
    openai: 'bg-green-100 text-green-800 hover:bg-green-200',
    deepseek: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    fal: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    eden: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  }
  return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

function ModelDetailsPopover({ model }: { model: ModelInfo }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <span className="text-xs">?</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{model.displayName}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {model.metadata?.description}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="font-medium">Context Length</span>
              </div>
              <p className="text-muted-foreground">
                {model.capabilities?.contextLength.toLocaleString()} tokens
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Avg Response</span>
              </div>
              <p className="text-muted-foreground">
                {model.metadata?.averageResponseTime}s
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="font-medium text-xs">Specializations</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {model.metadata?.specialization?.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ModelSelector({
  selectedModel,
  availableModels,
  onModelChange,
  isLoading = false,
  className = '',
}: ModelSelectorProps) {
  const handleModelSelect = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (model && model.id !== selectedModel?.id) {
      onModelChange(model)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">AI Model</label>
        {selectedModel && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>
              ${selectedModel.pricing?.price}/
              {selectedModel.pricing?.price_unit_quantity}{' '}
              {selectedModel.pricing?.price_unit_type}s
            </span>
          </div>
        )}
      </div>

      <Select
        value={selectedModel?.id || ''}
        onValueChange={handleModelSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an AI model...">
            {selectedModel && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${getProviderColor(
                    selectedModel.provider
                  )}`}
                >
                  {selectedModel.provider}
                </Badge>
                <span className="font-medium">{selectedModel.displayName}</span>
                {selectedModel.features.includes('multimodal') && (
                  <Badge variant="secondary" className="text-xs">
                    Vision
                  </Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-80">
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="p-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getProviderColor(
                          model.provider
                        )}`}
                      >
                        {model.provider}
                      </Badge>
                      <span className="font-medium">{model.displayName}</span>
                      {model.features.includes('multimodal') && (
                        <Badge variant="secondary" className="text-xs">
                          Vision
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {model.capabilities?.contextLength.toLocaleString()}{' '}
                        tokens
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        ${model.pricing?.price}/
                        {model.pricing?.price_unit_quantity}{' '}
                        {model.pricing?.price_unit_type}s
                      </span>
                    </div>
                  </div>
                </div>
                <ModelDetailsPopover model={model} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedModel && (
        <div className="text-xs text-muted-foreground">
          {selectedModel.metadata?.description}
        </div>
      )}
    </div>
  )
}
