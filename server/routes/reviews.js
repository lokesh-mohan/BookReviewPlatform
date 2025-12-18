const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const Book = require("../models/Book")
const auth = require("../middleware/auth")

// Get reviews for a book
router.get("/", async (req, res) => {
  try {
    const { bookId } = req.query

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" })
    }

    const reviews = await Review.find({ book: bookId }).populate("user", "username").sort({ createdAt: -1 })

    res.json(reviews)
  } catch (err) {
    console.error("Error fetching reviews:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get reviews by a user
router.get("/user", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (err) {
    console.error("Error fetching user reviews:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new review
router.post("/", auth, async (req, res) => {
  try {
    const { bookId, rating, content } = req.body

    if (!bookId || !rating || !content) {
      return res.status(400).json({ message: "Book ID, rating, and content are required" })
    }

    // Check if book exists
    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: req.user.id,
    })

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book" })
    }

    // Create new review
    const newReview = new Review({
      book: bookId,
      user: req.user.id,
      rating,
      content,
    })

    await newReview.save()

    // Update book's average rating and review count
    const allReviews = await Review.find({ book: bookId })
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    book.averageRating = averageRating
    book.reviewCount = allReviews.length
    await book.save()

    // Populate user info for response
    await newReview.populate("user", "username")

    res.status(201).json(newReview)
  } catch (err) {
    console.error("Error adding review:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a review
router.put("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review" })
    }

    const { rating, content } = req.body

    // Update fields
    if (rating) review.rating = rating
    if (content) review.content = content

    await review.save()

    // Update book's average rating
    const bookId = review.book
    const allReviews = await Review.find({ book: bookId })
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    const book = await Book.findById(bookId)
    book.averageRating = averageRating
    await book.save()

    // Populate user info for response
    await review.populate("user", "username")

    res.json(review)
  } catch (err) {
    console.error("Error updating review:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a review
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" })
    }

    const bookId = review.book

    await Review.findByIdAndDelete(req.params.id)

    // Update book's average rating and review count
    const allReviews = await Review.find({ book: bookId })

    const book = await Book.findById(bookId)

    if (allReviews.length === 0) {
      book.averageRating = 0
      book.reviewCount = 0
    } else {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / allReviews.length

      book.averageRating = averageRating
      book.reviewCount = allReviews.length
    }

    await book.save()

    res.json({ message: "Review deleted successfully" })
  } catch (err) {
    console.error("Error deleting review:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
