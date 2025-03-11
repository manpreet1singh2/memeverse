export interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  followers: number
  following: number
  memeCount: number
  totalLikes?: number
  badge?: string
}

export interface Comment {
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

export interface Meme {
  id: string
  title: string
  description?: string
  imageUrl: string
  likes: number
  commentCount: number
  user: {
    id: string
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
  comments: Comment[]
}

export interface MemeSearchParams {
  search?: string
  category?: string
  sortBy?: string
  page?: number
  limit?: number
}

export interface MemeUploadData {
  title: string
  description?: string
  tags: string[]
  imageData: string
}

export interface SearchResult {
  memes: Meme[]
  hasMore: boolean
}

