import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Wait for auth to be checked
    if (authLoading) return

    // If not logged in, redirect to login
    if (!user) {
      navigate('/login')
      return
    }

    // Check if user is admin
    if (!user.admin) {
      navigate('/')
      return
    }

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/v1/users', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError(err.message)
        // For development, use mock data if API fails
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'co-admin' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, authLoading, navigate])

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.message)
    }
  }

  const handlePromoteToCoAdmin = async (userId) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/promote`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to promote user')
      }

      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: 'co-admin' } : u
      ))
    } catch (err) {
      console.error('Error promoting user:', err)
      setError(err.message)
    }
  }

  const handleDemoteFromCoAdmin = async (userId) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/demote`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to demote user')
      }

      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: 'user' } : u
      ))
    } catch (err) {
      console.error('Error demoting user:', err)
      setError(err.message)
    }
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Don't render anything if not logged in or not admin
  if (!user || !user.admin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{
        backgroundImage: 'url(/images/2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full" style={{
      backgroundImage: 'url(/images/2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'co-admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                        {user.role === 'user' && (
                          <button
                            onClick={() => handlePromoteToCoAdmin(user.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Promote to Co-Admin
                          </button>
                        )}
                        {user.role === 'co-admin' && (
                          <button
                            onClick={() => handleDemoteFromCoAdmin(user.id)}
                            className="text-yellow-600 hover:text-yellow-900 font-medium"
                          >
                            Demote to User
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 