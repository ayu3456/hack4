"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Search, Code2 } from "lucide-react"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const handleOSSDiscoveryClick = () => {
    window.open('https://devconnectoss.vercel.app/', '_blank')
    onOpenChange(false) // Close sidebar after navigation
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
<Button
  onClick={handleOSSDiscoveryClick}
  className="
    w-full 
    flex items-center 
    gap-3 
    h-12 
    px-4 
    bg-white 
    text-gray-800 
    font-medium 
    border border-gray-200 
    rounded-lg 
    shadow-sm 
    hover:bg-gray-50 
    transition 
    duration-200 
    ease-in-out
  "
>
  <Search className="h-5 w-5" />
  OSS Discovery Engine
</Button>


        </div>
      </SheetContent>
    </Sheet>
  )
}
