"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Award, Trophy, Medal } from "lucide-react"
import { motion } from "framer-motion"
import { getTopMemes, getTopUsers } from "@/lib/api"
import type { Meme, User } from "@/lib/types"

export default function LeaderboardPage() {
  const [topMemes, setTopMemes] = useState<Meme[]>([])
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [memes, users] = await Promise.all([getTopMemes(), getTopUsers()])
        setTopMemes(memes)
        setTopUsers(users)
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="font-bold">{index + 1}</span>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      <Tabs defaultValue="memes">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="memes">Top Memes</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
        </TabsList>

        <TabsContent value="memes">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoading
              ? Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-48 bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))
              : topMemes.map((meme, index) => (
                  <motion.div key={meme.id} variants={item}>
                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <Link href={`/meme/${meme.id}`}>
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={meme.imageUrl || "/placeholder.svg?height=600&width=600"}
                              alt={meme.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        </Link>
                        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full p-1 flex items-center gap-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getRankIcon(index)}
                            <span>#{index + 1}</span>
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <Link href={`/meme/${meme.id}`} className="hover:underline">
                          <h3 className="font-semibold text-lg line-clamp-1">{meme.title}</h3>
                        </Link>

                        <div className="flex items-center justify-between mt-2">
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

                          <div className="flex items-center gap-3">
                            <span className="flex items-center text-sm text-muted-foreground">
                              <Heart className="h-4 w-4 mr-1 text-red-500 fill-red-500" />
                              {meme.likes}
                            </span>
                            <span className="flex items-center text-sm text-muted-foreground">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {meme.commentCount}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="users">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoading
              ? Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1">
                            <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              : topUsers.map((user, index) => (
                  <motion.div key={user.id} variants={item}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -left-2 bg-background rounded-full p-1">
                              <Badge
                                variant="secondary"
                                className="flex items-center justify-center h-6 w-6 rounded-full p-0"
                              >
                                {getRankIcon(index)}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <Link href={`/user/${user.username}`} className="font-semibold text-lg hover:underline">
                              {user.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>

                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm">
                                <span className="font-medium">{user.memeCount}</span> memes
                              </span>
                              <span className="text-sm">
                                <span className="font-medium">{user.totalLikes}</span> likes
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Badge variant="outline" className="bg-primary/10">
                            <Award className="h-3 w-3 mr-1" />
                            {user.badge}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

