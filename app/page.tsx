import Link from "next/link"
import { MemeGrid } from "@/components/meme-grid"
import { HeroSection } from "@/components/hero-section"
import { TrendingTags } from "@/components/trending-tags"
import { Button } from "@/components/ui/button"
import { getTrendingMemes } from "@/lib/api"

export default async function Home() {
  const memes = await getTrendingMemes()

  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Memes</h2>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/upload">
              <Button>Upload Meme</Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline">Explore All</Button>
            </Link>
          </div>
        </div>

        <TrendingTags />

        <MemeGrid memes={memes} />
      </div>
    </main>
  )
}

