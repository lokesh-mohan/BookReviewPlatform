"use client"

import { createContext, useState, useEffect } from "react"
import { API_URL } from "../utils/constants"

export const BookContext = createContext()

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([])
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBooks = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      // Add filters to query params
      if (filters.search) {
        queryParams.append("search", filters.search)
      }

      if (filters.genres && filters.genres.length > 0) {
        filters.genres.forEach((genre) => {
          queryParams.append("genre", genre)
        })
      }

      if (filters.minRating) {
        queryParams.append("minRating", filters.minRating)
      }

      if (filters.sortBy) {
        queryParams.append("sortBy", filters.sortBy)
      }

      const response = await fetch(`${API_URL}/books?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const data = await response.json()

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedBooks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/books/featured`)

      if (!response.ok) {
        throw new Error("Failed to fetch featured books")
      }

      const data = await response.json()
      setFeaturedBooks(data)

      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookById = async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/books/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch book")
      }

      const data = await response.json()

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchBookReviews = async (bookId) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/reviews?bookId=${bookId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data = await response.json()

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addReview = async (bookId, reviewData) => {
    try {
      setError(null)

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be logged in to submit a review")
      }

      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          rating: reviewData.rating,
          content: reviewData.content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit review")
      }

      const data = await response.json()

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchFeaturedBooks()
  }, [])

  return (
    <BookContext.Provider
      value={{
        books,
        featuredBooks,
        loading,
        error,
        fetchBooks,
        fetchBookById,
        fetchBookReviews,
        addReview,
      }}
    >
      {children}
    </BookContext.Provider>
  )
}
