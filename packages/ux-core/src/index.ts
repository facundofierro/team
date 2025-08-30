// Core exports
export * from './types'
export * from './utils'

// Component library exports
export * from './components/shadcn'
export * from './components/tailark'
export * from './components/origin'
export * from './components/motion'
export * from './components/ai-sdk'
export * from './components/aceternity'

// TeamHub custom components
export * from './components-core'

// TeamHub site components
export * from './components-site'

// Re-export commonly used components for convenience
export { Button } from './components/shadcn/button'
export {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/shadcn/card'
export { Badge } from './components/shadcn/badge'
export { Input } from './components/shadcn/input'
export { Label } from './components/shadcn/label'
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/shadcn/select'
export { Separator } from './components/shadcn/separator'
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/shadcn/dialog'
