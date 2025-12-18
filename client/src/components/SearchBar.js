"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <input
        type="text"
        className="input pl-10 pr-4 py-2"
        placeholder="Search for books by title, author, or genre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  )
}

export default SearchBar
