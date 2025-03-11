"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const notFoundMemes = [
  {
    imageUrl: "/placeholder.svg?height=400&width=400",
    caption: "404: Meme not found. Just like my motivation.",
  },
  {
    imageUrl: "/placeholder.svg?height=400&width=400",
    caption: "When you navigate to a page that doesn't exist",
  },
  {
    imageUrl: "/placeholder.svg?height=400&width=400",
    caption: "Me trying to find this page",
  },
  {
    imageUrl: "/placeholder.svg?height=400&width=400",
    caption: "404: Page has gone to get milk and cigarettes",
  },
]

export default function NotFound() {
  const [randomMeme, setRandomMeme] = useState(notFoundMemes[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * notFoundMemes.length)
    setRandomMeme(notFoundMemes[randomIndex])
  }, [])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="relative w-full aspect-square mb-8">
          <Image
            src={randomMeme.imageUrl || "/placeholder.svg"}
            alt="404 Not Found Meme"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">{randomMeme.caption}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Take Me Home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/explore">Explore Memes Instead</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

