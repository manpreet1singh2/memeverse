"use client"
import { Heart, MessageCircle, Share2, Bookmark, Flag, Facebook, Twitter, LinkIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleLike, toggleSave } from "@/lib/features/memes/memesSlice"
import type { Meme } from "@/lib/types"

interface MemeActionsProps {
  meme: Meme
}

export function MemeActions({ meme }: MemeActionsProps) {
  const dispatch = useAppDispatch()
  const { likedMemes, savedMemes } = useAppSelector((state) => state.memes)
  const { isLoggedIn } = useAppSelector((state) => state.auth)
  const { toast } = useToast()

  const handleLike = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to like memes",
        variant: "destructive",
      })
      return
    }

    dispatch(toggleLike(meme.id))
  }

  const handleSave = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to save memes",
        variant: "destructive",
      })
      return
    }

    dispatch(toggleSave(meme.id))

    toast({
      title: savedMemes[meme.id] ? "Removed from saved" : "Saved to collection",
      description: savedMemes[meme.id]
        ? "This meme has been removed from your saved collection"
        : "This meme has been added to your saved collection",
    })
  }

  const handleShare = (platform: string) => {
    // In a real app, this would use the Web Share API or create sharing links
    toast({
      title: `Shared on ${platform}`,
      description: "Link copied to clipboard",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://memeverse.example.com/meme/${meme.id}`)
    toast({
      title: "Link copied",
      description: "Meme link copied to clipboard",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center gap-2", likedMemes[meme.id] ? "text-red-500" : "text-muted-foreground")}
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", likedMemes[meme.id] && "fill-red-500")} />
            <span>{likedMemes[meme.id] ? meme.likes + 1 : meme.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground"
            onClick={() => document.getElementById("comment-input")?.focus()}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{meme.commentCount}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleShare("Facebook")}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Message")}>
                <Send className="h-4 w-4 mr-2" />
                Send in Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(savedMemes[meme.id] ? "text-yellow-500" : "text-muted-foreground")}
            onClick={handleSave}
          >
            <Bookmark className={cn("h-5 w-5", savedMemes[meme.id] && "fill-yellow-500")} />
            <span className="sr-only">Save</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              toast({
                title: "Meme reported",
                description: "Thank you for helping keep MemeVerse safe",
              })
            }}
          >
            <Flag className="h-5 w-5" />
            <span className="sr-only">Report</span>
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  )
}

