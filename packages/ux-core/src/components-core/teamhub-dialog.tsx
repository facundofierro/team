import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/shadcn/dialog'
import { cn } from '../utils/cn'
import { DialogProps } from '../types'

export const TeamHubDialog: React.FC<DialogProps> = ({
  children,
  open,
  onOpenChange,
  title,
  className,
  ...props
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'bg-background border-border text-foreground',
          'shadow-lg',
          className
        )}
      >
        {title && (
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default TeamHubDialog
