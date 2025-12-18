"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []

  // Always show first page
  pages.push(1)

  // Calculate range of pages to show
  const startPage = Math.max(2, currentPage - 1)
  const endPage = Math.min(totalPages - 1, currentPage + 1)

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push("...")
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    pages.push("...")
  }

  // Add last page if there is more than one page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? "bg-emerald-600 text-white"
              : page === "..."
                ? "text-gray-500"
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination
