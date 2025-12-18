"use client"

import { useState, useContext } from "react"
import { Star } from "lucide-react"
import { AuthContext } from "../context/AuthContext"
import { BookContext } from "../context/BookContext"

const ReviewForm = ({ bookId }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useContext(AuthContext)
  const { addReview } = useContext(BookContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to submit a review")
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (content.trim() === "") {
      setError("Please enter a review")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await addReview(bookId, { rating, content })
      setRating(0)
      setContent("")
    } catch (err) {
      setError(err.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p>
          Please{" "}
          <a href="/login" className="text-emerald-600 font-medium">
            login
          </a>{" "}
          to leave a review.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer ${
                (hoverRating || rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="review"
          rows="4"
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this book..."
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}

export default ReviewForm
