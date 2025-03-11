// This is a mock data service that would be replaced with real API calls in a production app

export type Comment = {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  createdAt: string
  likes: number
  replies?: Comment[]
}

export type Meme = {
  id: string
  title: string
  description?: string
  imageUrl: string
  likes: number
  commentCount: number // Renamed from comments to commentCount
  user: {
    name: string
    username: string
    avatar: string
    bio?: string
    followers: number
    following: number
    memeCount: number
  }
  tags: string[]
  createdAt: string
  comments: Comment[] // This remains as the actual comments array
}

const mockMemes: Meme[] = [
  {
    id: "1",
    title: "When the code finally works after 5 hours of debugging",
    description: "Every developer knows this feeling of triumph!",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 1542,
    commentCount: 87,
    user: {
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
  {
    id: "3",
    title: "Gaming moments that make you question everything",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 1876,
    commentCount: 92,
    user: {
      name: "GamerPro",
      username: "gamerpro",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Living in a virtual world",
      followers: 4321,
      following: 567,
      memeCount: 76,
    },
    tags: ["gaming", "videogames", "funny", "rage"],
    createdAt: "2023-05-13T18:45:00Z",
    comments: [],
  },
  {
    id: "4",
    title: "Monday morning vibes",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 3254,
    commentCount: 187,
    user: {
      name: "MemeQueen",
      username: "memequeen",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Creating memes is my therapy",
      followers: 12543,
      following: 876,
      memeCount: 243,
    },
    tags: ["monday", "work", "funny", "relatable"],
    createdAt: "2023-05-12T08:30:00Z",
    comments: [],
  },
  {
    id: "5",
    title: "When someone asks if I'm productive during work from home",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 2187,
    commentCount: 134,
    user: {
      name: "RemoteWorker",
      username: "remoteworker",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Professional pajama wearer",
      followers: 3456,
      following: 234,
      memeCount: 67,
    },
    tags: ["wfh", "remotework", "funny", "productivity"],
    createdAt: "2023-05-11T11:20:00Z",
    comments: [],
  },
  {
    id: "6",
    title: "Movie logic that makes no sense",
    imageUrl: "/placeholder.svg?height=600&width=600",
    likes: 1654,
    commentCount: 98,
    user: {
      name: "FilmBuff",
      username: "filmbuff",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Cinema enthusiast and meme creator",
      followers: 5678,
      following: 432,
      memeCount: 112,
    },
    tags: ["movies", "hollywood", "funny", "logic"],
    createdAt: "2023-05-10T15:40:00Z",
    comments: [],
  },
]

export async function getMemes(): Promise<Meme[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockMemes
}

export async function getMemeById(id: string): Promise<Meme | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockMemes.find((meme) => meme.id === id)
}

export async function getRelatedMemes(currentId: string, tags: string[]): Promise<Meme[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Find memes with similar tags, excluding the current meme
  return mockMemes.filter((meme) => meme.id !== currentId && meme.tags.some((tag) => tags.includes(tag))).slice(0, 3)
}

