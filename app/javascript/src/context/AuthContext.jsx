import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/users/current', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Auth check response data:', data)
          if (data.user) {
            setUser(data.user)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData) => {
    console.log('Setting user data:', userData)
    setUser(userData)
  }

  const updateUser = (updatedData) => {
    console.log('Updating user data:', updatedData)
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }))
  }

  const logout = async () => {
    try {
      console.log('Attempting logout...')
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
      console.log('CSRF Token:', csrfToken)

      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        }
      })
      
      console.log('Logout response status:', response.status)
      const data = await response.json()
      console.log('Logout response data:', data)
      
      if (response.ok) {
        console.log('Logout successful')
        setUser(null)
        // Clear any stored data
        localStorage.clear()
        sessionStorage.clear()
        // Force a page reload to clear any cached state
        window.location.replace('/')
      } else {
        console.error('Logout failed:', data)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 