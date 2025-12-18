"use client"

import { useState, useEffect, useContext } from "react"
import { BookContext } from "../context/BookContext"
import BookCard from "../components/BookCard"
import SearchBar from "../components/SearchBar"
import Filters from "../components/Filters"
import Pagination from "../components/Pagination"
import { BookOpen } from "lucide-react"

const BooksPage = () => {
  const { fetchBooks, loading, error } = useContext(BookContext)
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [filters, setFilters] = useState({
    search: "",
    genres: [],
    minRating: "",
    sortBy: "newest",
  })
  const [genres, setGenres] = useState([
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Children",
  ])

  useEffect(() => {
    loadBooks()
  }, [currentPage, filters])

  const loadBooks = async () => {
    try {
      const result = await fetchBooks(currentPage, 12, filters)
      setBooks(result.books)
      setTotalPages(result.totalPages)
      setTotalBooks(result.totalCount)
    } catch (err) {
      console.error("Error loading books:", err)
    }
  }

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, search: query }))
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Books</h1>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <SearchBar onSearch={handleSearch} />

        {totalBooks > 0 && (
          <p className="text-gray-600">
            Showing {books.length} of {totalBooks} books
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 lg:w-1/5">
          <Filters genres={genres} onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4 lg:w-4/5">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BooksPage
