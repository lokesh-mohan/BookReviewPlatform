"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { BookContext } from "../context/BookContext"
import ReviewCard from "../components/ReviewCard"
import ReviewForm from "../components/ReviewForm"
import { Star, BookOpen, Clock, User } from "lucide-react"
import { formatDate } from "../utils/helpers"

const BookDetailPage = () => {
  const { id } = useParams()
  const { fetchBookById, fetchBookReviews, loading, error } = useContext(BookContext)
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      try {
        const bookData = await fetchBookById(id)
        setBook(bookData)

        // Load reviews after book is loaded
        loadReviews(id)
      } catch (err) {
        console.error("Error loading book:", err)
      }
    }

    loadBook()
  }, [id])

  const loadReviews = async (bookId) => {
    try {
      setReviewsLoading(true)
      const reviewsData = await fetchBookReviews(bookId)
      setReviews(reviewsData)
    } catch (err) {
      console.error("Error loading reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const refreshReviews = () => {
    loadReviews(id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book not found</h2>
        <p className="text-gray-600">The book you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 p-6 flex justify-center">
            <img
              src={book.coverImage || "/placeholder.svg?height=400&width=300"}
              alt={book.title}
              className="w-full max-w-xs object-cover rounded-md shadow-md"
            />
          </div>

          <div className="md:w-2/3 lg:w-3/4 p-6">
            <div className="mb-4">
              {book.genres &&
                book.genres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    {genre}
                  </span>
                ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-700">
                {book.averageRating.toFixed(1)} ({book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Published: {formatDate(book.publishedDate)}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{book.pageCount} pages</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>ISBN: {book.isbn}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>

          <div>
            <ReviewForm bookId={id} onReviewSubmitted={refreshReviews} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage
