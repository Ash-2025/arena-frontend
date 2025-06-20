import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface GameCardsProps {
  games: string[]
  className?: string
}

export function GameCards({ games, className }: GameCardsProps) {

  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [games])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
      checkScrollButtons()
    }
  }

  return (
    <div className={cn("relative w-full py-4", className)}>
      {/* Left Navigation Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50 shadow-lg transition-all duration-200",
          canScrollLeft ? "opacity-100 hover:bg-accent hover:scale-110" : "opacity-0 pointer-events-none",
        )}
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onWheel={handleWheel}
      >
        {games.map((gameName, index) => (
          <Card
            key={index}
            className={cn(
              "flex-shrink-0 w-48 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group border-border/50",
              "hover:border-border hover:bg-card/80 backdrop-blur-sm",
            )}
            onClick={() => navigate(`/${gameName}`)}
          >
            <CardContent className="p-6 flex items-center justify-center">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 text-center">
                {gameName}
              </h3>
              {/* Animated bottom border */}
              <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Right Navigation Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50 shadow-lg transition-all duration-200",
          canScrollRight ? "opacity-100 hover:bg-accent hover:scale-110" : "opacity-0 pointer-events-none",
        )}
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}