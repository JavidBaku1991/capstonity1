import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  const [cart, setCart] = useState({ line_items: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Cart component mounted, fetching cart data...');
    fetch('/api/v1/carts/current', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Cart response status:', response.status);
        console.log('Cart response headers:', response.headers);
        return response.json();
      })
      .then(data => {
        console.log('Cart data received:', data);
        if (data && data.line_items) {
          setCart(data);
        } else {
          console.error('Invalid cart data received:', data);
          setCart({ line_items: [] });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        setLoading(false);
      });
  }, []);

  const handleRemoveItem = (lineItemId) => {
    console.log('Removing item:', lineItemId);
    fetch(`/api/v1/cart_items/${lineItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(response => {
        console.log('Remove item response status:', response.status);
        if (response.ok) {
          setCart(prevCart => ({
            ...prevCart,
            line_items: prevCart.line_items.filter(item => item.id !== lineItemId)
          }))
        }
      })
      .catch(error => console.error('Error removing item:', error))
  }

  const handleUpdateQuantity = (lineItemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    fetch(`/api/v1/cart_items/${lineItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cart_item: { quantity: newQuantity } })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to update quantity');
      })
      .then(updatedItem => {
        // Fetch the updated cart to get the new total
        return fetch('/api/v1/carts/current', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
      })
      .then(updatedCart => {
        setCart(updatedCart);
      })
      .catch(error => console.error('Error updating quantity:', error));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('Rendering cart with data:', cart);

  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      backgroundImage: 'url(/images/2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
    
      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {cart.line_items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flow-root">
              <ul className="space-y-4">
                {cart.line_items.map((item) => (
                  <li 
                    key={item.id} 
                    className="py-6 flex items-center bg-white/90 shadow-md rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={item.product.image_url || "/images/1.png"}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="ml-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">${item.product.price}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-600">−</span>
                          </button>
                          <span className="text-gray-700 font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-600">+</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors flex items-center"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${cart.total_price}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Checkout
                </Link>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{' '}
                  <Link to="/products" className="text-blue-600 font-medium hover:text-blue-500">
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart 