import React, { useEffect, memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = memo(({ children }) => {
  console.log('LAYOUT - Component rendering')
  const { user, loading, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => {
    console.log('LAYOUT - useEffect triggered')
    console.log('LAYOUT - Current user:', user)
    console.log('LAYOUT - Current loading state:', loading)
  }, [user, loading])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    logout()
  }

  const renderAuthButtons = () => {
    console.log('LAYOUT - Rendering auth buttons')
    console.log('LAYOUT - Current user in renderAuthButtons:', user)
    console.log('LAYOUT - Current loading state in renderAuthButtons:', loading)
    
    if (loading) {
      console.log('LAYOUT - Still loading, showing nothing')
      return null
    }
    
    if (user) {
      console.log('LAYOUT - User is logged in, showing user controls')
      return (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            <span className="mr-2">Welcome, {user.name || user.email}</span>
            <svg
              className={`h-5 w-5 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    console.log('LAYOUT - No user, showing login/signup buttons')
    return (
      <>
        <Link
          to="/login"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </Link>
      </>
    )
  }
  
  console.log('LAYOUT - About to render main component')
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-transparent absolute top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-white">
                  Artisani
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-white text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-blue-200 hover:border-blue-200"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="border-transparent text-white hover:border-blue-200 hover:text-blue-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="border-transparent text-white hover:border-blue-200 hover:text-blue-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Cart
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {!loading && children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 Artisani. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
})

Layout.displayName = 'Layout'

export default Layout 