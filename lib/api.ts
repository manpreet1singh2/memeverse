import type { Meme, User, MemeSearchParams, MemeUploadData, SearchResult } from "@/lib/types"

// Mock data for trending memes
const mockMemes: Meme[] = [
  {
    id: "1",
    title: "When the code finally works after 5 hours of debugging",
    description: "Every developer knows this feeling of triumph!",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 1542,
    commentCount: 87,
    user: {
      id: "user1",
      name: "CodeMaster",
      username: "codemaster",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Full-stack developer by day, meme creator by night",
      followers: 5432,
      following: 321,
      memeCount: 98,
    },
    tags: ["programming", "debugging", "developer", "coding"],
    createdAt: "2023-05-15T14:23:00Z",
    comments: [
      {
        id: "c1",
        user: {
          name: "DevFunny",
          username: "devfunny",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This is literally me every single day 😂",
        createdAt: "2023-05-15T15:30:00Z",
        likes: 42,
        replies: [
          {
            id: "r1",
            user: {
              name: "CodeMaster",
              username: "codemaster",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "The struggle is real!",
            createdAt: "2023-05-15T16:05:00Z",
            likes: 12,
          },
        ],
      },
      {
        id: "c2",
        user: {
          name: "BugHunter",
          username: "bughunter",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "And then you realize it was just a missing semicolon...",
        createdAt: "2023-05-15T17:45:00Z",
        likes: 78,
      },
    ],
  },
  {
    id: "2",
    title: "Cat memes never get old",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 2341,
    commentCount: 156,
    user: {
      id: "user2",
      name: "CatLover",
      username: "catlover",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Just here for the cat memes",
      followers: 8765,
      following: 432,
      memeCount: 154,
    },
    tags: ["cats", "funny", "animals", "cute"],
    createdAt: "2023-05-14T09:12:00Z",
    comments: [
      {
        id: "c3",
        user: {
          name: "DogPerson",
          username: "dogperson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "I'm more of a dog person, but this is hilarious!",
        createdAt: "2023-05-14T10:30:00Z",
        likes: 23,
      },
    ],
  },
  // Add more mock memes as needed
]

// Mock data for top users
const mockUsers: User[] = [
  {
    id: "user1",
    name: "CodeMaster",
    username: "codemaster",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Full-stack developer by day, meme creator by night",
    followers: 5432,
    following: 321,
    memeCount: 98,
    totalLikes: 12543,
    badge: "Meme Lord",
  },
  {
    id: "user2",
    name: "CatLover",
    username: "catlover",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Just here for the cat memes",
    followers: 8765,
    following: 432,
    memeCount: 154,
    totalLikes: 9876,
    badge: "Cat Whisperer",
  },
  // Add more mock users as needed
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API functions
export async function getTrendingMemes(): Promise<Meme[]> {
  await delay(800) // Simulate network delay
  return mockMemes
}

export async function getMemeById(id: string): Promise<Meme | null> {
  await delay(500)
  const meme = mockMemes.find((m) => m.id === id)
  return meme || null
}

export async function fetchMemes(params: MemeSearchParams): Promise<SearchResult> {
  await delay(1000)

  let filteredMemes = [...mockMemes]

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredMemes = filteredMemes.filter(
      (meme) =>
        meme.title.toLowerCase().includes(searchLower) ||
        meme.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Apply category filter
  if (params.category && params.category !== "all") {
    // This is a simplified example - in a real app, you'd have proper category data
    if (params.category === "trending") {
      filteredMemes = filteredMemes.sort((a, b) => b.likes - a.likes)
    } else if (params.category === "new") {
      filteredMemes = filteredMemes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  // Apply sorting
  if (params.sortBy) {
    if (params.sortBy === "popular") {
      filteredMemes = filteredMemes.sort((a, b) => b.likes - a.likes)
    } else if (params.sortBy === "recent") {
      filteredMemes = filteredMemes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (params.sortBy === "comments") {
      filteredMemes = filteredMemes.sort((a, b) => b.commentCount - a.commentCount)
    }
  }

  // Apply pagination
  const page = params.page || 1
  const limit = params.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedMemes = filteredMemes.slice(startIndex, endIndex)

  return {
    memes: paginatedMemes,
    hasMore: endIndex < filteredMemes.length,
  }
}

export async function getTopMemes(): Promise<Meme[]> {
  await delay(800)
  return [...mockMemes].sort((a, b) => b.likes - a.likes).slice(0, 10)
}

export async function getTopUsers(): Promise<User[]> {
  await delay(800)
  return mockUsers
}

export async function generateAICaption(imageData: string): Promise<string> {
  await delay(1500) // Simulate AI processing time

  // In a real app, you would send the image to an AI service
  // For this demo, we'll return a random caption
  const captions = [
    "When you finally understand the code you wrote last week",
    "Me explaining to my mom why I need a new gaming PC",
    "That moment when the deadline is tomorrow and you haven't started",
    "How I look waiting for my code to compile",
    "When someone says they can build your app idea for $100",
  ]

  return captions[Math.floor(Math.random() * captions.length)]
}

export async function uploadMeme(data: MemeUploadData): Promise<{ success: boolean; memeId?: string }> {
  await delay(2000) // Simulate upload time

  // In a real app, you would upload the image to a service like Cloudinary
  // and save the meme data to your database

  console.log("Meme uploaded:", data)

  return {
    success: true,
    memeId: `meme-${Date.now()}`,
  }
}

