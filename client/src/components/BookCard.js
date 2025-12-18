import { Link } from "react-router-dom"
import { Star } from "lucide-react"

const BookCard = ({ book }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <Link to={`/books/${book._id}`}>
        <img
          src={book.coverImage || "/placeholder.svg?height=300&width=200"}
          alt={book.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(book.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BookCard
