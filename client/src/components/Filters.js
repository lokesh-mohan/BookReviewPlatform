"use client"

import { useState } from "react"
import { Filter } from "lucide-react"

const Filters = ({ genres, onFilterChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const [ratingFilter, setRatingFilter] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isOpen, setIsOpen] = useState(false)

  const handleGenreChange = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre]

    setSelectedGenres(updatedGenres)
    applyFilters(updatedGenres, ratingFilter, sortBy)
  }

  const handleRatingChange = (rating) => {
    setRatingFilter(rating)
    applyFilters(selectedGenres, rating, sortBy)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    applyFilters(selectedGenres, ratingFilter, sort)
  }

  const applyFilters = (genres, rating, sort) => {
    onFilterChange({
      genres,
      minRating: rating,
      sortBy: sort,
    })
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setRatingFilter("")
    setSortBy("newest")
    onFilterChange({
      genres: [],
      minRating: "",
      sortBy: "newest",
    })
  }

  return (
    <div className="mb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-gray-700 font-medium mb-2 sm:hidden">
        <Filter className="h-5 w-5 mr-1" />
        Filters {(selectedGenres.length > 0 || ratingFilter || sortBy !== "newest") && "(Active)"}
      </button>

      <div className={`${isOpen ? "block" : "hidden"} sm:block space-y-4 bg-white p-4 rounded-lg shadow-sm`}>
        <div>
          <h3 className="font-medium mb-2">Genre</h3>
          <div className="space-y-1">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Minimum Rating</h3>
          <select className="input" value={ratingFilter} onChange={(e) => handleRatingChange(e.target.value)}>
            <option value="">Any Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>

        <div>
          <h3 className="font-medium mb-2">Sort By</h3>
          <select className="input" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>

        {(selectedGenres.length > 0 || ratingFilter || sortBy !== "newest") && (
          <button onClick={clearFilters} className="text-sm text-emerald-600 hover:text-emerald-700">
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}

export default Filters
