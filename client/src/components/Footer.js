import { BookIcon } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BookIcon className="h-8 w-8 text-emerald-400" />
            <span className="ml-2 text-xl font-bold">BookReviews</span>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <a href="#" className="hover:text-emerald-400 mb-2 md:mb-0">
              About Us
            </a>
            <a href="#" className="hover:text-emerald-400 mb-2 md:mb-0">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 mb-2 md:mb-0">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BookReviews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
