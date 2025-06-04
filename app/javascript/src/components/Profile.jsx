import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from './ProductCard'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [userProducts, setUserProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Add Product form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  const navigate = useNavigate()

  console.log('PROFILE - Component rendering')
  console.log('PROFILE - Current user:', user)

  useEffect(() => {
    console.log('PROFILE - useEffect triggered')
    if (user && user.id) {
      console.log('PROFILE - Fetching products for user:', user.id)
      const url = `/users/${user.id}/products`
      console.log('PROFILE - Fetch URL:', url)
      
      fetch(url)
        .then(response => {
          console.log('PROFILE - Response status:', response.status)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log('PROFILE - Products data:', data)
          setUserProducts(data)
          setLoading(false)
          setError(null)
        })
        .catch(error => {
          console.error('PROFILE - Error fetching user products:', error)
          setError('Failed to load products. Please try again later.')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user])

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setUserProducts(userProducts.filter(product => product.id !== productId))
        setShowDeleteModal(false)
        setProductToDelete(null)
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product. Please try again later.')
    }
  }

  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('user[avatar]', file)

    try {
      const response = await fetch('/users/update', {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Update the user context with new data
        updateUser({
          avatar_url: data.user.avatar_url
        })
        setUploadError(null)
      } else {
        setUploadError(data.errors?.[0] || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setUploadError('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Add Product form handlers
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleAddProductSubmit = async (e) => {
    e.preventDefault()
    setAddLoading(true)
    setAddError('')

    if (!user) {
      setAddError('You must be logged in to add a product')
      setAddLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('product[name]', name)
    formData.append('product[description]', description)
    formData.append('product[price]', price)
    formData.append('product[stock]', stock)
    if (image) {
      formData.append('product[image]', image)
    }

    try {
      const response = await fetch('/products', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Add the new product to the user's products
        setUserProducts([data, ...userProducts])
        // Clear the form
        setName('')
        setDescription('')
        setPrice('')
        setStock('')
        setImage(null)
        setAddError('')
      } else {
        setAddError(data.error || 'Failed to create product')
      }
    } catch (err) {
      setAddError('An error occurred while creating the product')
    } finally {
      setAddLoading(false)
    }
  }

  if (!user) {
    console.log('PROFILE - No user, showing login prompt')
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Please log in to view your profile</h2>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    console.log('PROFILE - Loading state')
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-8 " 
    style={{ 
      backgroundImage: 'url(/images/2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="mt-12 bg-white/30 backdrop-blur-md shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden max-w-5xl w-full mx-4 my-8"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
        {/* Left column: Profile info only */}
        <div className="md:w-1/3 bg-white/30 backdrop-blur-md p-8 flex flex-col items-center border-r border-white/30">
          <img
            className="h-28 w-28 rounded-full object-cover mb-4"
            src={user.avatar_url || 'https://via.placeholder.com/96'}
            alt={user.name}
          />
          <div className="text-center w-full">
            <div className="font-medium text-lg mb-1">{user.name}</div>
            <div className="text-gray-600 text-sm mb-1">{user.email}</div>
            <div className="text-gray-600 text-sm mb-2">{user.phone_number}</div>
            <label className="block text-xs text-gray-500 mb-2 cursor-pointer">
              <span className="underline">Change profile picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {uploadError && (
              <p className="text-xs text-red-600 mb-2">{uploadError}</p>
            )}
          </div>
        </div>
        {/* Right column: Add a product form */}
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-8 text-center">Add a product</h2>
          {addError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{addError}</span>
            </div>
          )}
          <form className="flex flex-col gap-6" onSubmit={handleAddProductSubmit}>
            <div className="flex items-center">
              <label className="w-32 text-lg font-medium">Name</label>
              <input
                type="text"
                className="flex-1 bg-gray-200 rounded-md px-4 py-2 ml-4"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-lg font-medium">Descripton</label>
              <textarea
                className="flex-1 bg-gray-200 rounded-md px-4 py-2 ml-4 resize-none"
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Product description"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-lg font-medium">Price</label>
              <input
                type="number"
                className="flex-1 bg-gray-200 rounded-md px-4 py-2 ml-4"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Product price"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-lg font-medium">Stock</label>
              <input
                type="number"
                className="flex-1 bg-gray-200 rounded-md px-4 py-2 ml-4"
                required
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="Product stock"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-lg font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                className="flex-1 ml-4"
                onChange={handleImageChange}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 self-end disabled:opacity-50"
              disabled={addLoading}
            >
              {addLoading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
      {/* My Products section */}
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg max-w-5xl w-full mx-4 my-8 p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">My Products</h3>
        {userProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {userProducts.map((product) => (
              <ProductCard key={product.id} product={{
                ...product,
                image: product.image_url || 'https://via.placeholder.com/300',
                title: product.name
              }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">You haven't added any products yet.</div>
        )}
      </div>
      {/* Delete modal remains unchanged */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(productToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile 