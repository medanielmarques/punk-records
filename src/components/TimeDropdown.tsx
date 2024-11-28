import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTime } from "@/lib/utils"

import { Button } from "./ui/button"

interface TimeDropdownProps {
  timeRemaining: number
  onAdjust: (amount: number) => void
}

export function TimeDropdown({ timeRemaining, onAdjust }: TimeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-24 font-mono">
          {formatTime(timeRemaining)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAdjust(5)}>
          +5 minutes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdjust(15)}>
          +15 minutes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdjust(-5)}>
          -5 minutes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdjust(-15)}>
          -15 minutes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
