const express = require("express")
const router = express.Router()
const Book = require("../models/Book")
const Review = require("../models/Review")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Get all books with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = {}

    // Search by title, author, or description
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    // Filter by genre
    if (req.query.genre) {
      const genres = Array.isArray(req.query.genre) ? req.query.genre : [req.query.genre]
      query.genres = { $in: genres }
    }

    // Filter by minimum rating
    if (req.query.minRating) {
      query.averageRating = { $gte: Number.parseFloat(req.query.minRating) }
    }

    // Sorting
    let sort = { createdAt: -1 } // Default: newest first

    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case "oldest":
          sort = { createdAt: 1 }
          break
        case "rating-high":
          sort = { averageRating: -1 }
          break
        case "rating-low":
          sort = { averageRating: 1 }
          break
        case "title-asc":
          sort = { title: 1 }
          break
        case "title-desc":
          sort = { title: -1 }
          break
      }
    }

    // Execute query with pagination
    const books = await Book.find(query).sort(sort).skip(skip).limit(limit)

    // Get total count for pagination
    const totalCount = await Book.countDocuments(query)

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    })
  } catch (err) {
    console.error("Error fetching books:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get featured books
router.get("/featured", async (req, res) => {
  try {
    const featuredBooks = await Book.find({ featured: true }).sort({ averageRating: -1 }).limit(8)

    res.json(featuredBooks)
  } catch (err) {
    console.error("Error fetching featured books:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json(book)
  } catch (err) {
    console.error("Error fetching book:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new book (admin only)
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, author, description, isbn, publishedDate, pageCount, genres, coverImage } = req.body

    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn })

    if (existingBook) {
      return res.status(400).json({ message: "Book with this ISBN already exists" })
    }

    const newBook = new Book({
      title,
      author,
      description,
      isbn,
      publishedDate,
      pageCount,
      genres,
      coverImage,
    })

    await newBook.save()

    res.status(201).json(newBook)
  } catch (err) {
    console.error("Error adding book:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a book (admin only)
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    const { title, author, description, isbn, publishedDate, pageCount, genres, coverImage, featured } = req.body

    // Update fields
    if (title) book.title = title
    if (author) book.author = author
    if (description) book.description = description
    if (isbn) book.isbn = isbn
    if (publishedDate) book.publishedDate = publishedDate
    if (pageCount) book.pageCount = pageCount
    if (genres) book.genres = genres
    if (coverImage) book.coverImage = coverImage
    if (featured !== undefined) book.featured = featured

    await book.save()

    res.json(book)
  } catch (err) {
    console.error("Error updating book:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a book (admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Delete all reviews for this book
    await Review.deleteMany({ book: req.params.id })

    // Delete the book
    await Book.findByIdAndDelete(req.params.id)

    res.json({ message: "Book deleted successfully" })
  } catch (err) {
    console.error("Error deleting book:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
