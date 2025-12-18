const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
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

// Prevent duplicate reviews from the same user for the same book
reviewSchema.index({ book: 1, user: 1 }, { unique: true })

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
