import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  console.log('Products component - Auth loading:', authLoading)
  console.log('Products component - User state:', user)
  console.log('Products component - Is user logged in?', !!user)
  console.log('Products component - User email:', user?.email)
  console.log('Products component - User name:', user?.name)

  useEffect(() => {
    fetch('/products.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch('/api/v1/cart_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        const error = await response.json();
        alert('Failed to add product to cart: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding to cart');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full" style={{
      backgroundImage: 'url(/images/2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-white text-center w-full">All Products</h2>
          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/products/new"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Product
              </Link>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white p-4 rounded-lg shadow-md">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.image_url || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm text-gray-700 font-medium">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <p className="mt-2 text-sm text-gray-600">Posted by: {product.user_name}</p>
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/products/${product.id}`}
                  className="w-full text-center text-blue-600 hover:text-blue-800 py-2 px-4 rounded-md border border-blue-600 hover:border-blue-800 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products 