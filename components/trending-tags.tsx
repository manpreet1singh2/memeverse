"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const trendingTags = [
  { name: "funny", count: 2453 },
  { name: "cats", count: 1872 },
  { name: "gaming", count: 1654 },
  { name: "programming", count: 1432 },
  { name: "movies", count: 1298 },
  { name: "anime", count: 1187 },
  { name: "dogs", count: 1054 },
  { name: "sports", count: 987 },
  { name: "food", count: 876 },
  { name: "music", count: 765 },
  { name: "politics", count: 654 },
  { name: "science", count: 543 },
]

export function TrendingTags() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef) {
      setMaxScroll(containerRef.scrollWidth - containerRef.clientWidth)
    }
  }, [containerRef])

  const scroll = (direction: "left" | "right") => {
    if (!containerRef) return

    const scrollAmount = 200
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount)

    containerRef.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
  }

  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Trending Tags</h3>
        <Link href="/tags" className="text-sm text-primary hover:underline">
          View All Tags
        </Link>
      </div>

      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm",
            scrollPosition <= 0 && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => scroll("left")}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          className="flex overflow-x-auto scrollbar-hide py-2 px-8 -mx-8 scroll-smooth"
          ref={setContainerRef}
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {trendingTags.map((tag) => (
            <Link key={tag.name} href={`/tag/${tag.name}`} className="flex-none mr-2 last:mr-0">
              <div className="bg-muted hover:bg-primary/10 transition-colors px-4 py-2 rounded-full flex items-center gap-2">
                <span className="font-medium">#{tag.name}</span>
                <span className="text-xs text-muted-foreground">{tag.count}</span>
              </div>
            </Link>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm",
            scrollPosition >= maxScroll && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => scroll("right")}
          disabled={scrollPosition >= maxScroll}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

