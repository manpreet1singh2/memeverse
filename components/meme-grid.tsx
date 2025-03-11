"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleLike, toggleSave } from "@/lib/features/memes/memesSlice"
import { Skeleton } from "@/components/ui/skeleton"
import type { Meme } from "@/lib/types"

interface MemeGridProps {
  memes: Meme[]
  loadMore?: () => Promise<void>
  isLoading?: boolean
}

export function MemeGrid({ memes, loadMore, isLoading = false }: MemeGridProps) {
  const dispatch = useAppDispatch()
  const { likedMemes, savedMemes } = useAppSelector((state) => state.memes)
  const [animatingHearts, setAnimatingHearts] = useState<Record<string, boolean>>({})
  const [ref, inView] = useInView()
  const loadingRef = useRef(false)

  useEffect(() => {
    if (inView && loadMore && !isLoading && !loadingRef.current) {
      loadingRef.current = true
      loadMore().finally(() => {
        loadingRef.current = false
      })
    }
  }, [inView, loadMore, isLoading])

  const handleLike = (id: string) => {
    dispatch(toggleLike(id))

    if (!likedMemes[id]) {
      setAnimatingHearts((prev) => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setAnimatingHearts((prev) => ({ ...prev, [id]: false }))
      }, 1000)
    }
  }

  const handleSave = (id: string) => {
    dispatch(toggleSave(id))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {memes.map((meme) => (
          <motion.div key={meme.id} variants={item}>
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <Link href={`/meme/${meme.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={meme.imageUrl || "/placeholder.svg?height=600&width=600"}
                    alt={meme.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
              </Link>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Link href={`/meme/${meme.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg line-clamp-2">{meme.title}</h3>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", savedMemes[meme.id] ? "text-yellow-500" : "text-muted-foreground")}
                    onClick={() => handleSave(meme.id)}
                    aria-label={savedMemes[meme.id] ? "Unsave meme" : "Save meme"}
                  >
                    <Bookmark className={cn("h-5 w-5", savedMemes[meme.id] && "fill-yellow-500")} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {meme.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={meme.user.avatar} alt={meme.user.name} />
                    <AvatarFallback>{meme.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/user/${meme.user.username}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {meme.user.name}
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1 px-2",
                        likedMemes[meme.id] ? "text-red-500" : "text-muted-foreground",
                      )}
                      onClick={() => handleLike(meme.id)}
                      aria-label={likedMemes[meme.id] ? "Unlike meme" : "Like meme"}
                    >
                      <Heart className={cn("h-4 w-4", likedMemes[meme.id] && "fill-red-500")} />
                      <span>{likedMemes[meme.id] ? meme.likes + 1 : meme.likes}</span>
                    </Button>
                    <AnimatePresence>
                      {animatingHearts[meme.id] && (
                        <motion.div
                          initial={{ scale: 0, y: 0, opacity: 0 }}
                          animate={{ scale: 1.5, y: -20, opacity: [0, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute top-0 left-2 pointer-events-none"
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link href={`/meme/${meme.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 px-2 text-muted-foreground"
                      aria-label="View comments"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{meme.commentCount}</span>
                    </Button>
                  </Link>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Share meme">
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {loadMore && <div ref={ref} className="h-10 mt-8" />}
    </>
  )
}

