"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Plus, ImageIcon, Wand2 } from "lucide-react"
import { generateAICaption, uploadMeme } from "@/lib/api"
import { useAppSelector } from "@/lib/hooks"

export default function UploadPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [captionPosition, setCaptionPosition] = useState("bottom")
  const [isUploading, setIsUploading] = useState(false)
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isLoggedIn } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to upload memes",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isLoggedIn, router, toast])

  useEffect(() => {
    if (imagePreview && caption) {
      renderMemePreview()
    }
  }, [imagePreview, caption, captionPosition])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const renderMemePreview = () => {
    if (!imagePreview || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Add caption
      if (caption) {
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.font = "bold 36px Impact"
        ctx.textAlign = "center"

        const x = canvas.width / 2
        let y

        if (captionPosition === "top") {
          y = 50
        } else if (captionPosition === "bottom") {
          y = canvas.height - 30
        } else {
          y = canvas.height / 2
        }

        // Draw text with stroke
        ctx.strokeText(caption, x, y)
        ctx.fillText(caption, x, y)
      }
    }
    img.src = imagePreview
  }

  const handleAddTag = () => {
    if (!currentTag.trim()) return
    if (tags.includes(currentTag.trim())) {
      toast({
        title: "Tag already exists",
        description: "This tag has already been added",
        variant: "destructive",
      })
      return
    }
    if (tags.length >= 10) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 10 tags",
        variant: "destructive",
      })
      return
    }
    setTags([...tags, currentTag.trim()])
    setCurrentTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleGenerateCaption = async () => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingCaption(true)
    try {
      const generatedCaption = await generateAICaption(imagePreview)
      setCaption(generatedCaption)
      toast({
        title: "Caption generated",
        description: "AI has generated a caption for your meme",
      })
    } catch (error) {
      toast({
        title: "Failed to generate caption",
        description: "Please try again or add your own caption",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your meme",
        variant: "destructive",
      })
      return
    }

    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please upload an image for your meme",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Get final meme image from canvas if caption exists
      let finalImage = imagePreview
      if (caption && canvasRef.current) {
        finalImage = canvasRef.current.toDataURL("image/jpeg")
      }

      await uploadMeme({
        title,
        description,
        tags,
        imageData: finalImage,
      })

      toast({
        title: "Upload successful!",
        description: "Your meme has been uploaded successfully",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your meme. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload a Meme</h1>
        <p className="text-muted-foreground">Share your funniest memes with the MemeVerse community</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="md:order-2">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your meme will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                {imagePreview ? (
                  caption ? (
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Meme preview"
                      fill
                      className="object-contain"
                    />
                  )
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Your meme preview will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 md:order-1">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your meme a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add some context to your meme"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium mb-1">Click to upload</p>
                <p className="text-sm text-muted-foreground mb-2">SVG, PNG, JPG or GIF (Max 10MB)</p>
                <Button type="button" variant="outline" size="sm">
                  Select File
                </Button>
              </div>
            </div>

            {imagePreview && (
              <div className="space-y-2">
                <Label>Add Caption</Label>
                <div className="flex gap-2 mb-2">
                  <Textarea
                    placeholder="Add a funny caption to your meme"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    onClick={handleGenerateCaption}
                    disabled={isGeneratingCaption}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isGeneratingCaption ? "Generating..." : "AI Caption"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={captionPosition === "top" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCaptionPosition("top")}
                  >
                    Top
                  </Button>
                  <Button
                    type="button"
                    variant={captionPosition === "middle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCaptionPosition("middle")}
                  >
                    Middle
                  </Button>
                  <Button
                    type="button"
                    variant={captionPosition === "bottom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCaptionPosition("bottom")}
                  >
                    Bottom
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Add up to 10 tags to help others find your meme</p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Meme"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

