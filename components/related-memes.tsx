import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"
import type { Meme } from "@/lib/types"

interface RelatedMemesProps {
  memes: Meme[]
}

export function RelatedMemes({ memes }: RelatedMemesProps) {
  if (memes.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No related memes found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {memes.map((meme) => (
        <Link key={meme.id} href={`/meme/${meme.id}`}>
          <div className="group flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={meme.imageUrl || "/placeholder.svg"}
                alt={meme.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {meme.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center text-xs text-muted-foreground">
                  <Heart className="h-3 w-3 mr-1" />
                  {meme.likes}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {meme.commentCount}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

