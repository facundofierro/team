'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Settings2 } from 'lucide-react'
import { ToolType, ToolWithTypes } from '@teamhub/db'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type ToolCardProps = {
  tools: ToolWithTypes[]
  toolTypes: ToolType[]
  onChange: (tools: ToolWithTypes[]) => void
}

type AddToolSheetProps = {
  isOpen: boolean
  onClose: () => void
  toolTypes: ToolType[]
  onAdd: (tool: Partial<ToolWithTypes>) => void
}

function AddToolSheet({
  isOpen,
  onClose,
  toolTypes,
  onAdd,
}: AddToolSheetProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [name, setName] = useState('')
  const [config, setConfig] = useState<Record<string, string>>({})
  const [isManaged, setIsManaged] = useState(false)

  const selectedToolType = toolTypes.find((t) => t.type === selectedType)

  const handleSubmit = () => {
    if (!selectedToolType) return

    onAdd({
      type: selectedType,
      name,
      configuration: config,
      isActive: true,
      isManaged,
    })
    onClose()
    setSelectedType('')
    setName('')
    setConfig({})
    setIsManaged(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Tool</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tool Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select tool type" />
              </SelectTrigger>
              <SelectContent>
                {toolTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tool name"
            />
          </div>

          {selectedToolType?.canBeManaged && (
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="managed"
                  checked={isManaged}
                  onChange={(e) => setIsManaged(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <Label htmlFor="managed">Managed Tool</Label>
              </div>
              {selectedToolType.managedPriceDescription && (
                <p className="text-sm text-muted-foreground">
                  {selectedToolType.managedPriceDescription}
                </p>
              )}
            </div>
          )}

          {!!selectedToolType?.configurationParams && (
            <div className="grid gap-4">
              <Label>Configuration</Label>
              {Object.entries(selectedToolType.configurationParams).map(
                ([key, param]) => (
                  <div key={key} className="grid gap-2">
                    <Label>{param.description}</Label>
                    <Input
                      type={param.type}
                      value={config[key] || ''}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                )
              )}
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!selectedType || !name}>
            Add Tool
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ToolsCard({ tools, toolTypes, onChange }: ToolCardProps) {
  const [isAddingTool, setIsAddingTool] = useState(false)

  const handleAddTool = (newTool: Partial<ToolWithTypes>) => {
    onChange([...tools, newTool as ToolWithTypes])
  }

  return (
    <Card className="h-full bg-cardLight">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tools</CardTitle>
        <Button size="sm" onClick={() => setIsAddingTool(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell>{tool.description}</TableCell>
                <TableCell className="capitalize">{tool.type}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tool.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}
                  >
                    {tool.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      title="Configure tool"
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      title="Remove tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AddToolSheet
        isOpen={isAddingTool}
        onClose={() => setIsAddingTool(false)}
        toolTypes={toolTypes}
        onAdd={handleAddTool}
      />
    </Card>
  )
}
