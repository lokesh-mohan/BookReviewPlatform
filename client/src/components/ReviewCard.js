import { Star, User } from "lucide-react"
import { formatDate } from "../utils/helpers"

const ReviewCard = ({ review }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="bg-gray-200 rounded-full p-2">
            <User className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h4 className="font-medium text-gray-900 mr-2">{review.user.username}</h4>
            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="text-gray-700">{review.content}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
