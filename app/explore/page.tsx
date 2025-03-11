"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { MemeGrid } from "@/components/meme-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { fetchMemes } from "@/lib/api"
import type { Meme } from "@/lib/types"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [category, setCategory] = useState("trending")
  const [sortBy, setSortBy] = useState("popular")
  const [memes, setMemes] = useState<Meme[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const loadMemes = useCallback(
    async (reset = false) => {
      if (isLoading) return

      setIsLoading(true)
      try {
        const newPage = reset ? 1 : page
        const result = await fetchMemes({
          search: debouncedSearchTerm,
          category,
          sortBy,
          page: newPage,
          limit: 9,
        })

        if (reset) {
          setMemes(result.memes)
        } else {
          setMemes((prev) => [...prev, ...result.memes])
        }

        setHasMore(result.hasMore)
        if (!reset) {
          setPage(newPage + 1)
        }
      } catch (error) {
        console.error("Failed to load memes:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [debouncedSearchTerm, category, sortBy, page, isLoading],
  )

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadMemes()
    }
  }, [hasMore, isLoading, loadMemes])

  useEffect(() => {
    setPage(1)
    loadMemes(true)
  }, [debouncedSearchTerm, category, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Memes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search memes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="random">Random</TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          <MemeGrid memes={memes} loadMore={loadMore} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="new">
          <MemeGrid memes={memes} loadMore={loadMore} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="classic">
          <MemeGrid memes={memes} loadMore={loadMore} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="random">
          <MemeGrid memes={memes} loadMore={loadMore} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

