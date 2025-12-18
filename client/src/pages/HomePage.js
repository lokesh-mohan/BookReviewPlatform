"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { BookContext } from "../context/BookContext"
import BookCard from "../components/BookCard"
import { BookOpen } from "lucide-react"

const HomePage = () => {
  const { featuredBooks, loading, error } = useContext(BookContext)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover Your Next Favorite Book
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Join our community of book lovers. Read reviews, share your thoughts, and find your next great read.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/books" className="btn bg-white text-emerald-700 hover:bg-gray-100">
                Browse Books
              </Link>
              <Link to="/register" className="btn bg-emerald-500 text-white hover:bg-emerald-400 border border-white">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
            <p className="mt-4 text-lg text-gray-600">Explore our handpicked selection of must-read books</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : featuredBooks.length === 0 ? (
            <div className="text-center text-gray-600">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No featured books available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/books" className="btn btn-primary">
              View All Books
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Join our community in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free and become a part of our growing community of book enthusiasts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Books</h3>
              <p className="text-gray-600">
                Browse our extensive collection of books across various genres and find your next read.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Thoughts</h3>
              <p className="text-gray-600">Rate books, write reviews, and help others discover great literature.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your reading journey?</h2>
          <p className="text-xl mb-8">Join thousands of readers who have found their next favorite book with us.</p>
          <Link to="/register" className="btn bg-emerald-600 text-white hover:bg-emerald-700">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
