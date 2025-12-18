"use client"

import { createContext, useState, useEffect } from "react"
import { API_URL } from "../utils/constants"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token")
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const register = async (username, email, password) => {
    try {
      setError(null)

      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)

      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)

      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)

      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateProfile = async (userData) => {
    try {
      setError(null)

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be logged in")
      }

      const response = await fetch(`${API_URL}/users/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setUser({ ...user, ...data })

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
