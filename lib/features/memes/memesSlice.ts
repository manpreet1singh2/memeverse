import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface MemesState {
  likedMemes: Record<string, boolean>
  savedMemes: Record<string, boolean>
}

// Load initial state from localStorage if available
const getInitialState = (): MemesState => {
  if (typeof window !== "undefined") {
    try {
      const likedMemes = localStorage.getItem("likedMemes")
      const savedMemes = localStorage.getItem("savedMemes")

      return {
        likedMemes: likedMemes ? JSON.parse(likedMemes) : {},
        savedMemes: savedMemes ? JSON.parse(savedMemes) : {},
      }
    } catch (error) {
      console.error("Error loading memes state from localStorage:", error)
    }
  }

  return {
    likedMemes: {},
    savedMemes: {},
  }
}

const memesSlice = createSlice({
  name: "memes",
  initialState: getInitialState(),
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const memeId = action.payload
      state.likedMemes[memeId] = !state.likedMemes[memeId]

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes))
      }
    },
    toggleSave: (state, action: PayloadAction<string>) => {
      const memeId = action.payload
      state.savedMemes[memeId] = !state.savedMemes[memeId]

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("savedMemes", JSON.stringify(state.savedMemes))
      }
    },
  },
})

export const { toggleLike, toggleSave } = memesSlice.actions
export default memesSlice.reducer

