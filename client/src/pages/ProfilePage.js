"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { BookContext } from "../context/BookContext"
import { API_URL } from "../utils/constants"
import { User, Mail, Lock, BookOpen, Star } from "lucide-react"
import { formatDate } from "../utils/helpers"

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const { loading: bookLoading } = useContext(BookContext)

  const [activeTab, setActiveTab] = useState("profile")
  const [userReviews, setUserReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
      }))

      if (activeTab === "reviews") {
        fetchUserReviews()
      }
    }
  }, [user, activeTab])

  const fetchUserReviews = async () => {
    try {
      setReviewsLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be logged in")
      }

      const response = await fetch(`${API_URL}/reviews/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data = await response.json()
      setUserReviews(data)
    } catch (err) {
      console.error("Error fetching user reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      await updateProfile({
        username: formData.username,
      })

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      })
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be logged in")
      }

      const response = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password")
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setMessage({
        type: "success",
        text: "Password changed successfully",
      })
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to change password",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (bookLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-emerald-600 text-white text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4">
                <User className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-emerald-100">{user?.email}</p>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "profile" ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "security" ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "reviews" ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Reviews
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className="input pl-10"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Change Password</h2>

                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="input pl-10"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input pl-10"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-bold mb-6">My Reviews</h2>

                {reviewsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
                  </div>
                ) : userReviews.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-md text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">You haven't written any reviews yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userReviews.map((review) => (
                      <div key={review._id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{review.book.title}</h3>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
