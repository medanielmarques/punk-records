import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTime } from "@/lib/utils"

import { Button } from "./ui/button"

interface TimeDropdownProps {
  timeRemaining: number | null
  onAdjust: (amount: number) => void
}

export function TimeDropdown({ timeRemaining, onAdjust }: TimeDropdownProps) {
  if (timeRemaining === null) return null

  const handleAdjust = (amount: number) => {
    onAdjust(amount)
    // Removed autoclose behavior by not closing dropdown after click
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-24 border-transparent font-mono hover:bg-transparent dark:bg-transparent"
        >
          {formatTime(timeRemaining)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleAdjust(-10)}
          onSelect={(e) => e.preventDefault()}
        >
          -10 minutes
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAdjust(10)}
          onSelect={(e) => e.preventDefault()}
        >
          +10 minutes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
