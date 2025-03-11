"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Heart, Reply, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/types"
import { useAppSelector } from "@/lib/hooks"

interface CommentSectionProps {
  comments: Comment[]
  memeId: string
}

export function CommentSection({ comments, memeId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [allComments, setAllComments] = useState<Comment[]>(comments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

  const handleSubmitComment = () => {
    if (!commentText.trim()) return

    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        user: {
          name: user?.name || "Current User",
          username: user?.username || "currentuser",
          avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
        },
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      }

      setAllComments([newComment, ...allComments])
      setCommentText("")
      setIsSubmitting(false)

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      })
    }, 1000)
  }

  const handleLikeComment = (commentId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to like comments",
        variant: "destructive",
      })
      return
    }

    setAllComments(
      allComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} alt="Current user" />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            id="comment-input"
            placeholder={isLoggedIn ? "Add a comment..." : "Login to comment..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="resize-none mb-2"
            rows={3}
            disabled={!isLoggedIn}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!commentText.trim() || isSubmitting || !isLoggedIn}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>

      {allComments.length > 0 ? (
        <div className="space-y-6">
          {allComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">@{comment.user.username}</span>
                    <span className="text-muted-foreground text-sm ml-2">{formatDate(comment.createdAt)}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      {comment.user.username === user?.username && <DropdownMenuItem>Delete</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="mt-1 mb-2">{comment.content}</p>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" disabled={!isLoggedIn}>
                    <Reply className="h-4 w-4 mr-1" />
                    <span>Reply</span>
                  </Button>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                          <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium">{reply.user.name}</span>
                            <span className="text-muted-foreground text-sm ml-2">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="mt-1">{reply.content}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground"
                            disabled={!isLoggedIn}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            <span>{reply.likes}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}

