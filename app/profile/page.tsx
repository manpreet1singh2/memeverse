"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateProfile } from "@/lib/features/auth/authSlice"
import { getTrendingMemes } from "@/lib/api"
import { Camera } from "lucide-react"

export default function ProfilePage() {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)
  const { likedMemes, savedMemes } = useAppSelector((state) => state.memes)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect if not logged in
  if (!isLoggedIn && typeof window !== "undefined") {
    router.push("/")
    return null
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your profile",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      dispatch(
        updateProfile({
          name,
          bio,
          avatar: avatarPreview || user?.avatar,
        }),
      )

      setIsEditing(false)
      setIsLoading(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    }, 1000)
  }

  // Mock data for user's memes
  const userMemes = getTrendingMemes().then((memes) => memes.slice(0, 3))

  // Filter liked memes
  const likedMemeIds = Object.entries(likedMemes)
    .filter(([_, isLiked]) => isLiked)
    .map(([id]) => id)

  // Filter saved memes
  const savedMemeIds = Object.entries(savedMemes)
    .filter(([_, isSaved]) => isSaved)
    .map(([id]) => id)

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={avatarPreview || user?.avatar || "/placeholder.svg?height=96&width=96"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <div
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">@{user?.username}</p>
                    <p className="text-center mt-4">{bio || "No bio available"}</p>
                  </>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between text-center py-4">
                <div>
                  <p className="font-bold text-xl">0</p>
                  <p className="text-muted-foreground text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-xl">0</p>
                  <p className="text-muted-foreground text-sm">Following</p>
                </div>
                <div>
                  <p className="font-bold text-xl">0</p>
                  <p className="text-muted-foreground text-sm">Memes</p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/upload">Upload New Meme</a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="mymemes">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mymemes">My Memes</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="mymemes">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">You haven't uploaded any memes yet</h3>
                <p className="text-muted-foreground mb-4">Share your first meme with the community</p>
                <Button asChild>
                  <a href="/upload">Upload a Meme</a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="liked">
              {likedMemeIds.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Memes you've liked</h3>
                  {/* In a real app, you would fetch the actual memes by ID */}
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You've liked {likedMemeIds.length} memes</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">You haven't liked any memes yet</h3>
                  <p className="text-muted-foreground mb-4">Explore and like memes to see them here</p>
                  <Button asChild variant="outline">
                    <a href="/explore">Explore Memes</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedMemeIds.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Memes you've saved</h3>
                  {/* In a real app, you would fetch the actual memes by ID */}
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You've saved {savedMemeIds.length} memes</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">You haven't saved any memes yet</h3>
                  <p className="text-muted-foreground mb-4">Save memes to view them later</p>
                  <Button asChild variant="outline">
                    <a href="/explore">Explore Memes</a>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

