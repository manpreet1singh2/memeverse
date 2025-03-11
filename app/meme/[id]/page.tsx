import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comment-section"
import { RelatedMemes } from "@/components/related-memes"
import { getMemeById, fetchMemes } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { MemeActions } from "@/components/meme-actions"

interface MemePageProps {
  params: {
    id: string
  }
}

export default async function MemePage({ params }: MemePageProps) {
  const meme = await getMemeById(params.id)

  if (!meme) {
    notFound()
  }

  // Get related memes based on tags
  const relatedMemesResult = await fetchMemes({
    search: meme.tags.join(" "),
    limit: 3,
  })

  const relatedMemes = relatedMemesResult.memes.filter((m) => m.id !== meme.id)

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{meme.title}</h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={meme.user.avatar} alt={meme.user.name} />
                    <AvatarFallback>{meme.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/user/${meme.user.username}`} className="font-medium hover:underline">
                      {meme.user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatDate(meme.createdAt)}</p>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>

              <div className="relative aspect-square sm:aspect-video max-h-[600px] w-full overflow-hidden rounded-lg mb-6">
                <Image
                  src={meme.imageUrl || "/placeholder.svg"}
                  alt={meme.title}
                  fill
                  className="object-contain bg-muted/50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority
                />
              </div>

              <MemeActions meme={meme} />

              {meme.description && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{meme.description}</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {meme.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="bg-muted hover:bg-primary/10 transition-colors px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-6">Comments ({meme.comments.length})</h2>
              <CommentSection comments={meme.comments} memeId={meme.id} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">About Creator</h2>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={meme.user.avatar} alt={meme.user.name} />
                  <AvatarFallback>{meme.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/user/${meme.user.username}`} className="font-medium text-lg hover:underline">
                    {meme.user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">@{meme.user.username}</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{meme.user.bio || "No bio available"}</p>

              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="font-medium">{meme.user.followers}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-medium">{meme.user.following}</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="font-medium">{meme.user.memeCount}</p>
                  <p className="text-muted-foreground">Memes</p>
                </div>
              </div>

              <Button className="w-full">Follow</Button>
            </div>
          </div>

          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Related Memes</h2>
              <RelatedMemes memes={relatedMemes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

