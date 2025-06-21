import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ToolType } from '@teamhub/db'

interface ConfigurationParametersProps {
  toolType?: ToolType
  isManaged: boolean
  configuration: Record<string, string>
  setConfiguration: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export function ConfigurationParameters({
  toolType,
  isManaged,
  configuration,
  setConfiguration,
}: ConfigurationParametersProps) {
  if (
    !toolType?.configurationParams ||
    Object.keys(toolType.configurationParams).length === 0 ||
    isManaged
  ) {
    return null
  }

  return (
    <>
      <Label className="text-base font-medium">Configuration</Label>
      {Object.entries(toolType.configurationParams).map(([key, param]) => (
        <div key={key} className="grid gap-2">
          <Label htmlFor={`config-${key}`}>{param.description || key}</Label>
          <Input
            id={`config-${key}`}
            type={param.type || 'text'}
            value={configuration[key] || ''}
            onChange={(e) =>
              setConfiguration((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            placeholder={`Enter ${key}`}
          />
        </div>
      ))}
    </>
  )
}
