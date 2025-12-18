const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
      min: 1,
    },
    genres: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Add text index for search
bookSchema.index({ title: "text", author: "text", description: "text" })

const Book = mongoose.model("Book", bookSchema)

module.exports = Book
