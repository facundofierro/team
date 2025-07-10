import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Calendar } from 'lucide-react'

type ScheduledInfoBarProps = {
  scheduled: {
    date: Date
    description: string
  }
}

export function ScheduledInfoBar({ scheduled }: ScheduledInfoBarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start w-full gap-2 h-14 hover:bg-accent flex-shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled task - Click to view details</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Scheduled Task Details</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <p>Date: {scheduled.date.toLocaleString()}</p>
          <p>Description: {scheduled.description}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
