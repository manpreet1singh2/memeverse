"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const backgrounds = [
    "bg-gradient-to-r from-purple-600 to-pink-500",
    "bg-gradient-to-r from-blue-600 to-teal-500",
    "bg-gradient-to-r from-orange-600 to-red-500",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div className={`${backgrounds[currentBg]} transition-colors duration-1000 py-16 md:py-24`}>
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Welcome to MemeVerse</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover, share, and create the internet's funniest memes all in one place
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for memes..."
              className="pl-10 h-12 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus-visible:ring-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 px-6 bg-white text-purple-700 hover:bg-white/90">
            Search
          </Button>
        </motion.form>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/upload">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              Upload a Meme
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              Explore Trending
            </Button>
          </Link>
          <Link href="/categories">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              Browse Categories
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

