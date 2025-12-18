export const formatDate = (dateString) => {
  if (!dateString) return "Unknown date"

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }

  // Format: Month Day, Year (e.g., January 1, 2023)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const truncateText = (text, maxLength) => {
  if (!text) return ""
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + "..."
}
