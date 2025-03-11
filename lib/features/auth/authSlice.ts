import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  username: string
  avatar: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

// Load initial state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      const authData = localStorage.getItem("authData")
      if (authData) {
        return JSON.parse(authData)
      }
    } catch (error) {
      console.error("Error loading auth state from localStorage:", error)
    }
  }

  return {
    isLoggedIn: false,
    user: null,
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true
      state.user = action.payload

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authData", JSON.stringify(state))
      }
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null

      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authData", JSON.stringify(state))
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }

        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("authData", JSON.stringify(state))
        }
      }
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer

