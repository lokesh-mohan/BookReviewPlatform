const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Book = require("../models/Book")
const User = require("../models/User")
const Review = require("../models/Review")

// Load environment variables
dotenv.config()

// Sample data
const books = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on the author's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was 10 years old.",
    isbn: "9780061120084",
    publishedDate: new Date("1960-07-11"),
    pageCount: 336,
    genres: ["Fiction", "Classics", "Historical Fiction"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg",
    featured: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world and one poor stiff's attempt to find individuality.",
    isbn: "9780451524935",
    publishedDate: new Date("1949-06-08"),
    pageCount: 328,
    genres: ["Fiction", "Classics", "Science Fiction", "Dystopian"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
    featured: true,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story is of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession," it is an exquisitely crafted tale of America in the 1920s.',
    isbn: "9780743273565",
    publishedDate: new Date("1925-04-10"),
    pageCount: 180,
    genres: ["Fiction", "Classics", "Historical Fiction"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg",
    featured: true,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
    isbn: "9780547928227",
    publishedDate: new Date("1937-09-21"),
    pageCount: 310,
    genres: ["Fiction", "Fantasy", "Classics", "Adventure"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg",
    featured: true,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print." The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring.',
    isbn: "9780141439518",
    publishedDate: new Date("1813-01-28"),
    pageCount: 432,
    genres: ["Fiction", "Classics", "Romance"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg",
    featured: true,
  },
]

const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    username: "user1",
    email: "user1@example.com",
    password: "password123",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "password123",
  },
]

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err)
    process.exit(1)
  })

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({})
    await User.deleteMany({})
    await Review.deleteMany({})

    console.log("Cleared existing data")

    // Insert users
    const createdUsers = await User.insertMany(users)
    console.log(`Inserted ${createdUsers.length} users`)

    // Insert books
    const createdBooks = await Book.insertMany(books)
    console.log(`Inserted ${createdBooks.length} books`)

    // Create some reviews
    const reviews = [
      {
        book: createdBooks[0]._id,
        user: createdUsers[1]._id,
        rating: 5,
        content:
          "A timeless classic that everyone should read. The characters are so well developed and the story is powerful.",
      },
      {
        book: createdBooks[0]._id,
        user: createdUsers[2]._id,
        rating: 4,
        content: "Beautifully written with important themes that are still relevant today.",
      },
      {
        book: createdBooks[1]._id,
        user: createdUsers[1]._id,
        rating: 5,
        content:
          "A chilling dystopian novel that feels more relevant with each passing year. Orwell was truly ahead of his time.",
      },
      {
        book: createdBooks[2]._id,
        user: createdUsers[2]._id,
        rating: 4,
        content: "Fitzgerald's prose is beautiful and the story captures the essence of the Jazz Age perfectly.",
      },
    ]

    const createdReviews = await Review.insertMany(reviews)
    console.log(`Inserted ${createdReviews.length} reviews`)

    // Update book ratings
    for (const book of createdBooks) {
      const bookReviews = await Review.find({ book: book._id })

      if (bookReviews.length > 0) {
        const totalRating = bookReviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / bookReviews.length

        await Book.findByIdAndUpdate(book._id, {
          averageRating,
          reviewCount: bookReviews.length,
        })
      }
    }

    console.log("Updated book ratings")
    console.log("Database seeded successfully!")

    // Disconnect from MongoDB
    mongoose.disconnect()
  } catch (err) {
    console.error("Error seeding database:", err)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
