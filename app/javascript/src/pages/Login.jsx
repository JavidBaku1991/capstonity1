import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.content
    console.log('LOGIN - CSRF token from meta:', token)
    return token
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')

    const userData = {
      user: {
        email: username.trim(),
        password: password
      }
    }

    console.log('LOGIN - Sending login request with data:', userData)

    try {
      const csrfToken = getCsrfToken()
      console.log('LOGIN - Using CSRF token:', csrfToken)

      const response = await fetch('/users/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      })

      console.log('LOGIN - Response status:', response.status)
      const data = await response.json()
      console.log('LOGIN - Full response data:', data)

      if (response.ok) {
        console.log('LOGIN - Login successful, user data:', data.data.attributes)
        
        //  CSRF token 
        if (data.csrf_token) {
          const meta = document.querySelector('meta[name="csrf-token"]')
          if (meta) {
            meta.content = data.csrf_token
            console.log('LOGIN - Updated CSRF token in meta tag')
          }
        }
        
        //  we're passing the correct user data structure
        const userDataToSet = {
          id: data.data.id,
          email: data.data.attributes.email,
          name: data.data.attributes.name
        }
        console.log('LOGIN - Passing to login function:', userDataToSet)
        login(userDataToSet)
        console.log('LOGIN - Navigation to home page')
        navigate('/')
      } else {
        console.error('LOGIN - Login failed:', data)
        setError(data.error || data.status?.message || 'Login failed')
      }
    } catch (err) {
      console.error('LOGIN - Login error:', err)
      setError('An error occurred during login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf8ed]"
    style={{ 
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
    }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl p-6">
        <div 
          className="flex-1 p-8 flex flex-col justify-center min-w-[320px] max-w-md"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 1
          }}>
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: '#7c3f2c' }}>Log in</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="rounded-lg px-4 py-3 bg-white/50 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg mb-2"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="rounded-lg px-4 py-3 bg-white/50 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg mb-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-full bg-blue-700 hover:bg-blue-800 text-white text-lg py-2 px-8 font-semibold shadow transition w-fit self-start mb-2"
            >
              Log in
            </button>
          </form>
          <div className="mt-2 text-sm">
            Dont have an account?{' '}
            <span className="italic text-gray-700"><a href="/signup" className="underline">Sign up</a></span>
          </div>
        </div>
        {/* Image Side */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/images/2.png"
            alt="Pottery"
            className="rounded-none border-2 border-blue-400 object-cover w-[320px] h-[320px] md:w-[400px] md:h-[400px]"
            style={{ background: '#fff' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login 